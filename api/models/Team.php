<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Team extends Model
{
  public static function getByCategoryId($categoryId)
  {
    return parent::fetchAll("SELECT * FROM teams WHERE category_id = ?", [$categoryId]);
  }

  public static function getAll($competitionId)
  {
    return parent::fetchAll("SELECT * FROM teams WHERE competition_id = ?", [$competitionId]);
  }

  public static function syncDataByCategoryId($requestData, $competitionId, $categoryId)
  {
    // データベースから既存のデータを取得
    $existingData = $categoryId ? self::getByCategoryId($categoryId) : self::getAll($competitionId);

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
        $data["id"] = uniqid("team_");
        $data["competition_id"] = $competitionId;
        if($categoryId) $data["category_id"] = $categoryId;
        $insertData[] = $data;
      }
    }

    $result = parent::sync($deleteIds, $updateData, $insertData, "teams");

    return $result ? self::getAll($competitionId) : false;
  }

  public static function del($competitionId)
  {
    return parent::deleteAll("teams", "competition_id",$competitionId);
  }
}