<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Routine extends Model
{
  public static function getById($routineId, $round)
  {
    return parent::fetch("SELECT * FROM {$round}_routines WHERE id = ?", [$routineId]);
  }

  public static function getAll($competitionId){
    $qualifyRoutines = parent::fetchAll("SELECT r.id as id, category_id, number, has_d, has_h, has_t FROM qualify_routines r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    $semifinalRoutines = parent::fetchAll("SELECT r.id as id, category_id, number, has_d, has_h, has_t FROM semifinal_routines r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    $finalRoutines = parent::fetchAll("SELECT r.id as id, category_id, number, has_d, has_h, has_t FROM final_routines r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    return ["qualify" => count($qualifyRoutines) ? $qualifyRoutines : null, "semifinal" => count($semifinalRoutines) ? $semifinalRoutines : null, "final"=> count($finalRoutines) ? $finalRoutines : null];
  }

  public static function getByRound($competitionId, $round)
  {
    return parent::fetchAll("SELECT r.id as id, category_id, number, has_d, has_h, has_t FROM {$round}_routines r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
  }

  public static function syncData($requestData, $competitionId, $round)
  {
    // データベースから既存のデータを取得
    $existingData = self::getByRound($competitionId, $round);

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
        $data["id"] = uniqid("rtn_");
        $insertData[] = $data;
      }
    }

    $result = parent::sync($deleteIds, $updateData, $insertData, "{$round}_routines");
    return $result ? self::getByRound($competitionId, $round) : false;
  }
}