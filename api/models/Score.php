<?php
namespace model;
require_once __DIR__ . "/Model.php";

use db\DataSource;
use model\Model;
use errorhandler\ErrorHandler;


class Score extends Model
{
  public static function getById($scoreId)
  {
    return parent::fetch("SELECT * FROM scores WHERE id = ?", [$scoreId]);
  }

  public static function getScore($categoryId, $type, $round, $gender, $routine)
  {
    return parent::fetchAll("SELECT s.id as id, exe, diff, hd, time, pen, sum, order_id, maxmark, is_changed, dns FROM scores s JOIN orders o ON s.order_id = o.id WHERE type = ? AND category_id = ? AND round = ? AND gender = ? AND routine = ?", [$type, $categoryId, $round, $gender, $routine]);
  }

  public static function getEScore($categoryId, $type, $round, $gender, $routine)
  {
    return parent::fetchAll("SELECT e.id as id, judge, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, lnd, e.sum, score_id, s.order_id as order_id FROM escores e JOIN scores s ON e.score_id = s.id JOIN orders o ON s.order_id = o.id WHERE type = ? AND category_id = ? AND round = ? AND gender = ? AND routine = ?", [$type, $categoryId, $round, $gender, $routine]);
  }

  public static function getScoreAndPlayer($competitionId, $gender, $scoreType, $rounds)
  {
    $roundsStmt = str_replace("-", "' OR o.round = '",$rounds);
    $roundsStmt2 = str_replace("-", "' OR o2.round = '",$rounds);

    return parent::fetchAll(
      "SELECT s.id, s.{$scoreType}, p.name, p.team, o.round, p.gender 
            FROM scores s
            JOIN orders o ON s.order_id = o.id
            JOIN individual_players p ON o.player_id = p.id
            JOIN categories c ON p.category_id = c.id
            WHERE c.competition_id = ? AND p.gender = ? AND (o.round = '$roundsStmt')
              AND s.{$scoreType} = (
                SELECT MAX(s2.{$scoreType})
                FROM scores s2
                JOIN orders o2 ON s2.order_id = o2.id
                JOIN individual_players p2 ON o2.player_id = p2.id
                JOIN categories c2 ON p2.category_id = c2.id
                WHERE c2.competition_id = ? AND p2.gender = ? AND (o2.round = '$roundsStmt2'))"
      ,
      [$competitionId, $gender, $competitionId, $gender]
    );
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
            $response[$type][$gender][$round][$categoryId] = [];
            foreach ([1, 2] as $routine) {
              $response[$type][$gender][$round][$categoryId][$routine] = [
                "scores" => self::getScore($categoryId, $type, $round, $gender, $routine),
                "eScores" => self::getEScore($categoryId, $type, $round, $gender, $routine),
              ];
            }
          }
        }
      }
    }
    return $response;
  }

  public static function create($scoreData, $eScoreData)
  {
    $scoreData['id'] = uniqid("scr_");
    foreach ($eScoreData as $key => $data) {
      $eScoreData[$key]['id'] = uniqid("escr_");
      $eScoreData[$key]["score_id"] = $scoreData["id"];
      $eScoreData[$key]["judge"] = $key;
    }

    return parent::insertToOtherTables(["scores" => $scoreData, "escores" => $eScoreData]);
  }

  public static function patch($data, $scoreId)
  {
    return parent::update("scores", $data, $scoreId);
  }

  public static function patchAll($scoreData, $scoreId, $eScoreData, $eScoreIds)
  {
    $db = new DataSource();
    $db->begin();
    $result = [];

    try {
      $result[] = parent::updateLine($db, "scores", $scoreData, $scoreId);

      foreach ($eScoreData as $judge => $data) {
        $result[] = parent::updateLine($db, "escores", $data, $eScoreIds[$judge]);
      }

      $db->commit();

      // return some($result, fn($value) => $value === false);
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      // $error->addStatusAndError("DBError", "message", "更新に失敗しました[code:103]");
      $error->addStatusAndError("DBError", "message", $e->getMessage());
      $error->throwErrors();
    }
  }

  public static function del($scoreId)
  {
    return parent::delete("scores", $scoreId);
  }
}