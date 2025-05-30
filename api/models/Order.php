<?php
namespace model;
require_once __DIR__ . "/Model.php";
require_once __DIR__ . "/Category.php";
require_once __DIR__ . "/Result.php";
require_once __DIR__ . "/Rule.php";

use db\DataSource;
use model\Model;
use model\Category;
use model\Result;
use model\Rule;
use errorhandler\ErrorHandler;

class Order extends Model
{
  public static function getOrder($categoryId, $type, $round, $gender)
  {
    $response = [];
    $response[] = parent::fetchAll("SELECT * FROM orders WHERE type = ? AND category_id = ? AND round = ? AND gender = ? AND routine = 1 ORDER BY number", [$type, $categoryId, $round, $gender]);
    $response[] = parent::fetchAll("SELECT * FROM orders WHERE type = ? AND category_id = ? AND round = ? AND gender = ? AND routine = 2 ORDER BY number", [$type, $categoryId, $round, $gender]);

    return $response;
  }

  public static function getAll($categoryIds)
  {
    $response = [];
    foreach (["individual", "syncronized"] as $type) {
      $response[$type] = [];
      foreach (["men", "women", "mix"] as $gender) {
        $response[$type][$gender] = [];
        foreach (["qualify", "semifinal", "final"] as $round) {
          $response[$type][$gender][$round] = [];
          foreach ($categoryIds as $categoryId) {
            $response[$type][$gender][$round][$categoryId] = self::getOrder($categoryId, $type, $round, $gender);
          }
        }
      }
    }
    return $response;
  }

  public static function syncData($compType, $competitionId, $data)
  {
    //登録するカテゴリー、ラウンドの抽出
    $targets = splitArrayKeys($data);
    if (!$targets)
      return false;

    $db = new DataSource();
    $db->begin();

    try {
      foreach (["individual", "syncronized"] as $type) {
        foreach (["men", "women", "mix"] as $gender) {
          foreach ($targets as $target) {
            $categoryId = $target[0];
            $round = $target[1];

            $category = Category::getById($categoryId);
            $rounds = $category["rounds"];
            $isRandom = $category["is_random"];

            //試技順を設定する選手の抽出
            switch ($round) {
              case "qualify":
                $players = $db->select("SELECT p.id AS player_id, number, gender, p.category_id as category_id, grp FROM {$type}_players p JOIN categories c ON p.category_id = c.id WHERE competition_id = ? and c.id = ? and gender = ?", [$competitionId, $categoryId, $gender]);
                break;
              case "semifinal":
                $rule = Rule::getByRoundAndCategory($competitionId, "qualify", $categoryId);
                $nextround = $rule["nextround"];
                
                $result = $rule["is_total"]
                  ? Result::getQualifyResultByTotal($compType, $type, $gender, $categoryId)
                  : Result::getQualifyResultByBest($compType, $type, $gender, $categoryId);

                $players = self::createOrderedPlayers("semifinal", $result, $nextround, $isRandom);

                break;
              case "final":
                if ($rounds === "1") {
                  //ラウンド数が１なら予選と同じ処理
                  $players = $db->select("SELECT p.id AS player_id, number, gender, p.category_id as category_id, grp FROM {$type}_players p JOIN categories c ON p.category_id = c.id WHERE competition_id = ? and c.id = ? and gender = ?", [$competitionId, $categoryId, $gender]);
                } else {
                  //ラウンド数が２以上
                  $rule = Rule::getByRoundAndCategory($competitionId, "semifinal", $categoryId);
                  $nextround = $rule["nextround"];

                  $result = $compType === "TRA"
                    ? Result::getSemifinalResultOfTRA($type, $gender, $categoryId)
                    : Result::getSemifinalResultOfDMT($type, $gender, $categoryId);

                  $players = self::createOrderedPlayers("final", $result, $nextround, $isRandom);
                }
                break;
            }

            // 選手が存在しなければ次のループへ
            if (!$players)
              continue;

            //データベースへの登録
            foreach ($players as $player) {
              $playerId = $player['player_id'];
              $group = $player['grp'];
              $number = $player['number'];

              $routineNumber = $db->selectOne("SELECT routines FROM {$round}_rules WHERE category_id = ?", [$categoryId]);

              for ($i = 0; $i < (int) $routineNumber["routines"]; $i++) {
                // 該当するデータがあるか確認
                $order = $db->select("SELECT id FROM orders WHERE player_id = :player_id AND round = :round AND routine = :routine", ['player_id' => $playerId, 'round' => $round, 'routine' => strval($i + 1)]);

                if ($order) {
                  // データがある場合は更新
                  $db->execute("UPDATE orders SET number = :number WHERE player_id = :player_id AND round = :round AND routine = :routine", ['number' => $group * 100 + $number, 'player_id' => $playerId, 'round' => $round, 'routine' => strval($i + 1)]);
                } else {
                  // データがない場合は新規作成
                  $result = $db->execute("INSERT INTO orders (id, type, gender, player_id, round, number, routine, category_id) VALUES (:id, :type, :gender, :player_id, :round, :number, :routine, :category_id)", [
                    'id' => uniqid("odr_"),
                    'type' => $type,
                    'gender' => $gender,
                    'player_id' => $playerId,
                    'round' => $round,
                    'number' => $group * 100 + $number,
                    'routine' => strval($i + 1),
                    'category_id' => $categoryId,
                  ]);
                }
              }
            }
          }

          // 不要なデータの削除
          switch ($round) {
            case "qualify":
              $db->execute("DELETE FROM orders WHERE player_id NOT IN (SELECT id FROM individual_players) AND player_id NOT IN (SELECT id FROM syncronized_players) AND category_id = ? AND round = ?", [$categoryId, $round]);
              break;
            case "semifinal":
              $existedIds = array_map(function ($player) {
                return $player["player_id"];
              }, $players);
              $registeredPlayers = $db->select("SELECT player_id FROM orders WHERE category_id = ? AND round = 'semifinal' AND type = ? AND gender = ?", [$categoryId, $type, $gender]);
              $deleteIds = array_map(function ($player) {
                return $player["player_id"];
              }, $registeredPlayers);
              foreach ($existedIds as $id) {
                unset($deleteIds[array_search($id, $deleteIds)]);
              }

              foreach ($deleteIds as $id) {
                $db->execute("DELETE FROM orders WHERE player_id = ? AND round = 'semifinal'", [$id]);
              }
              break;
          }
        }
      }

      $db->commit();

      //レスポンスデータの作成
      $categoryIds = array_unique(array_column($targets, 0));
      $response = self::getAll($categoryIds);

      return $response;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "登録に失敗しました[code:308]");
      $error->throwErrors();
    }
  }

  private static function createOrderedPlayers($round, $result, $nextround, $isRandom)
  {
    $players = self::filterPlayersForNextRound($result, $nextround);
    $playersCount = count($players);

    if ($isRandom) {
      if ($round === "semifinal") {
        $randomOrder = generateUniqueRandomArray(count($players) - 1, 0);
      } else {
        $median = floor($playersCount / 2);
        $randomOrder1 = generateUniqueRandomArray($median - 1, 0);
        $randomOrder2 = generateUniqueRandomArray(count($players) - 1, $median);
        $randomOrder = array_merge($randomOrder1, $randomOrder2);
      }
    }

    foreach ($players as $key => $player) {
      $players[$key]["number"] = self::createOrderNumber($isRandom ? $randomOrder[$key] : intval($key), $playersCount);
      $players[$key]["grp"] = self::createOrderGroup($isRandom ? $randomOrder[$key] : intval($key), $playersCount);
    }
    return $players;
  }

  private static function filterPlayersForNextRound($result, $nextround)
  {
    $tempPlayers = array_values(array_filter($result, function ($player) use ($nextround) {
      return $player["rank"] <= $nextround;
    }));

    //オープン参加が次のラウンドに進む場合を計算
    $opens = countByKeyValue($tempPlayers, "is_open", 1);

    return array_values(array_filter($result, function ($player) use ($nextround, $opens) {
      return $player["rank"] <= $nextround + $opens;
    }));
  }

  private static function createOrderNumber($number, $playersCount)
  {
    $median = floor($playersCount / 2);
    return $number < $median ? $median - $number : $playersCount - $number;
  }

  private static function createOrderGroup($number, $playersCount)
  {
    $median = floor($playersCount / 2);
    return $number < $median ? 2 : 1;
  }

  public static function del($competitionId)
  {
    return parent::delete("orders", $competitionId);
  }
}