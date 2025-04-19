<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Player extends Model
{
  public static function getById($playerId, $type)
  {
    return parent::fetch("SELECT * FROM {$type}_players WHERE id = ?", [$playerId]);
  }

  public static function getAll($competitionId)
  {
    $individualPlayers = parent::fetchAll("SELECT p.id as id, category_id, gender, grp, number, is_open, p.name as name, phonetic, team FROM individual_players p JOIN categories c ON p.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    $syncronizedPlayers = parent::fetchAll("SELECT p.id as id, category_id, gender, grp, number, is_open, p.name as name, phonetic, team, name2, phonetic2, team2 FROM syncronized_players p JOIN categories c ON p.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    return ["individual" => $individualPlayers, "syncronized" => $syncronizedPlayers];
  }

  public static function getByType($competitionId, $type)
  {
    $stmt = ($type === "individual") ? "" : ",name2, phonetic2, team2";
    return parent::fetchAll("SELECT p.id as id, category_id, gender, grp, number, is_open, p.name as name, phonetic, team $stmt FROM {$type}_players p JOIN categories c ON p.category_id = c.id WHERE competition_id = ?", [$competitionId]);
  }

  public static function getCategorizedByType($competitionId, $type)
  {
    $players = self::getByType($competitionId, $type);
    $categoryIds = array_map(function ($item) {
      return $item["category_id"];
    }, $players);
    
    $uniqueCategoryIds = array_values(array_unique($categoryIds));

    $categorizedPlayers = array_map(function ($categoryId) use ($players) {
      return [
        "category_id" => $categoryId,
        "players" => array_values(array_filter($players, function ($item) use ($categoryId) {
          return $item["category_id"] === $categoryId;
        }))
      ];
    }, $uniqueCategoryIds);

    return count($categorizedPlayers) ? $categorizedPlayers : null;
  }

  public static function syncData($requestData, $competitionId, $type)
  {
    // データベースから既存のデータを取得
    $existingData = self::getByType($competitionId, $type);

    // IDをキーにした配列に変換
    $existingDataMap = [];
    foreach ($existingData as $data) {
      $existingDataMap[$data['id']] = $data;
    }

    $updateData = [];
    $insertData = [];
    $deleteIds = array_keys($existingDataMap);

    // リクエストデータの処理
    foreach ($requestData as $data) {
      if (isset($data['id']) && isset($existingDataMap[$data['id']])) {
        // 更新
        $updateData[] = $data;
        unset($deleteIds[array_search($data['id'], $deleteIds)]);
      } elseif (empty($data['id'])) {
        // 追加
        $data["id"] = uniqid("plyr_");
        $insertData[] = $data;
      }
    }

    $result = parent::sync($deleteIds, $updateData, $insertData, "{$type}_players");
    return $result ? self::getCategorizedByType($competitionId, $type) : false;
  }

  public static function delAll($competitionId, $type){
    return parent::deleteByColumn("{$type}_players","categories", "category_id", "competition_id", $competitionId );
  }
}