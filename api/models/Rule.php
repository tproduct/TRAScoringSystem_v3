<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Rule extends Model
{
  public static function getById($ruleId, $round)
  {
    return parent::fetch("SELECT * FROM {$round}_rules WHERE id = ?", [$ruleId]);
  }

  public static function getAll($competitionId)
  {
    $qualifyRules = parent::fetchAll("SELECT r.id as id, category_id, routines, is_total, nextround FROM qualify_rules r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    $semifinalRules = parent::fetchAll("SELECT r.id as id, category_id, routines, is_total, refresh, nextround FROM semifinal_rules r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    $finalRules = parent::fetchAll("SELECT r.id as id, category_id, routines, is_total, refresh FROM final_rules r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
    return ["qualify" => count($qualifyRules) ? $qualifyRules : null, "semifinal" => count($semifinalRules) ? $semifinalRules : null, "final" => count($finalRules) ? $finalRules : null];
  }

  public static function getByRound($competitionId, $round)
  {
    $refresh = $round !== "qualify" ? ",refresh" : "";
    $nextround = $round !== "final" ? ",nextround" : "";
    return parent::fetchAll("SELECT r.id as id, category_id, routines, is_total $nextround $refresh FROM {$round}_rules r JOIN categories c ON r.category_id = c.id WHERE competition_id = ?", [$competitionId]);
  }

  public static function getByRoundAndCategory($competitionId, $round, $categoryId)
  {
    $refresh = $round !== "qualify" ? ",refresh" : "";
    $nextround = $round !== "final" ? ",nextround" : "";
    return parent::fetch("SELECT r.id as id, category_id, routines, is_total $nextround $refresh FROM {$round}_rules r JOIN categories c ON r.category_id = c.id WHERE competition_id = ? AND c.id = ?", [$competitionId, $categoryId]);
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
        $data["id"] = uniqid("rule_");
        $insertData[] = $data;
      }
    }

    $result = parent::sync($deleteIds, $updateData, $insertData, "{$round}_rules");
    return $result ? self::getByRound($competitionId, $round) : false;
  }
}