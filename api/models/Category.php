<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Category extends Model
{
  public static function getById($categoryId)
  {
    return parent::fetch("SELECT * FROM categories WHERE id = ?", [$categoryId]);
  }

  public static function getAll($competitionId)
  {
    $result = parent::fetchAll("SELECT * FROM categories WHERE competition_id = ?", [$competitionId]);
    return count($result) ? $result : null;
  }

  public static function create($data)
  {
    $data['id'] = uniqid("cat_");

    return parent::insert("categories", $data);
  }

  public static function patch($data)
  {
    return parent::updateAllInSameTable("categories", $data);
  }

  public static function syncData($requestData, $competitionId)
  {
    // データベースから既存のデータを取得
    $existingData = self::getAll($competitionId) ?? [];

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
        $data["id"] = uniqid("cat_");
        $insertData[] = $data;
      }
    }

    $result = parent::sync($deleteIds, $updateData, $insertData, "categories");
    return $result ? self::getAll($competitionId) : false;
  }

  public static function del($competitionId)
  {
    return parent::deleteAll("categories", "competition_id",$competitionId);
  }
}