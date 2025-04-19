<?php
namespace model;

require_once __DIR__ . '/datasource.php';
require_once __DIR__ . "/../error/ErrorHandler.php";

use db\DataSource;
use errorhandler\ErrorHandler;

class Model
{

  public static function fetch($sql, $params)
  {
    $db = new DataSource();
    $result = $db->selectOne($sql, $params);
    return $result;
  }

  public static function fetchAll($sql, $params)
  {
    $db = new DataSource();
    $result = $db->select($sql, $params);
    return $result;
  }

  private static function insertLine($db, $table, $data)
  {
    $keys = implode(",", array_keys($data));
    $values = implode(",", array_map(function () {
      return "?";
    }, array_values($data)));
    $result = $db->execute("INSERT INTO $table($keys) VALUES ($values)", array_values($data));

    //成功時は登録したデータを返し、失敗時はfalseを返す
    return $result ? $data : false;
  }

  public static function insert($table, $data)
  {
    $db = new DataSource();
    $db->begin();
    try {
      $result = self::insertLine($db, $table, $data);
      $db->commit();

      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "登録に失敗しました[code:101]");
      $error->throwErrors();
    }
  }

  public static function insertToOtherTables($requestData)
  {
    $db = new DataSource();
    $db->begin();
    $result = [];

    try {
      foreach ($requestData as $table => $data) {
        if (isNestedAssoc($data)) {
          foreach ($data as $key => $value) {
            $result[] = self::insertLine($db, $table, $value);
          }
        } else {
          $result[] = self::insertLine($db, $table, $data);
        }
      }

      $db->commit();
      return some($result, fn($value) => $value === false) ? false : $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      // $error->addStatusAndError("DBError", "message", "登録に失敗しました[code:102]");
      $error->addStatusAndError("DBError", "message", $e->getMessage());
      $error->throwErrors();
    }
  }

  public static function updateLine($db, $table, $data, $id)
  {
    $stmt = implode(",", array_map(fn($key) => "$key = :$key", array_keys($data)));
    $data["id"] = $id;
    $result = $db->execute("UPDATE $table SET $stmt WHERE id = :id", $data);

    //成功時は登録したデータを返し、失敗時はfalseを返す
    return $result ? $data : false;
  }

  public static function update($table, $data, $id)
  {
    $db = new DataSource();
    $db->begin();
    try {
      $result = self::updateLine($db, $table, $data, $id);
      $db->commit();

      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "更新に失敗しました[code:103]");
      $error->throwErrors();
    }
  }

  public static function updateAllInSameTable($table, $requestData)
  {
    $db = new DataSource();
    $db->begin();
    $result = [];
    try {
      foreach ($requestData as $data) {
        $id = $data["id"];
        $updateData = array_filter($data, fn($key) => $key !== "id", ARRAY_FILTER_USE_KEY);
        $result[] = self::updateLine($db, $table, $updateData, $id);
      }
      $db->commit();
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "更新に失敗しました[code:104]");
      $error->throwErrors();
    }
  }

  public static function updateAllInDifferentTable($requestData)
  {
    $db = new DataSource();
    $db->begin();
    $result = [];

    try {
      foreach ($requestData as $table => $data) {
        if (isAssoc($data)) {
          $id = $data["id"];
          $updateData = array_filter($data, fn($key) => $key !== "id", ARRAY_FILTER_USE_KEY);
          $result[$table] = self::updateLine($db, $table, $updateData, $id);
        } else {
          foreach ($data as $value) {
            $id = $value["id"];
            $updateData = array_filter($value, fn($key) => $key !== "id", ARRAY_FILTER_USE_KEY);
            $result[$table][] = self::updateLine($db, $table, $updateData, $id);
          }
        }
      }
      $db->commit();
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "更新に失敗しました[code:105]");
      $error->throwErrors();
    }
  }

  public static function sync($deleteIds, $updateData, $insertData, $table)
  {
    $db = new DataSource();
    $db->begin();
    try {
      // 削除（リクエストになかったIDを削除）
      if (!empty($deleteIds)) {
        foreach ($deleteIds as $id) {
          self::delete($table, $id);
        }
      }
      if (!empty($updateData)) {
        foreach ($updateData as $data) {
          $id = $data["id"];
          $updateData = array_filter($data, fn($key) => $key !== "id", ARRAY_FILTER_USE_KEY);
          self::updateLine($db, $table, $updateData, $id);
        }
      }

      if (!empty($insertData)) {
        foreach ($insertData as $data) {
          self::insertLine($db, $table, $data);
        }
      }

      $db->commit();
      return true;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "同期に失敗しました[code:106]");
      $error->throwErrors();
    }
  }

  public static function delete($table, $id)
  {
    $db = new DataSource();
    $db->begin();
    try {
      $result = $db->execute("DELETE FROM $table WHERE id = :id", [$id]);
      $db->commit();
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "削除に失敗しました[code:107]");
      $error->throwErrors();
    }
  }

  public static function deleteByColumn($table, $tableForJoin, $columnKey, $columnCond, $value)
  {
    $db = new DataSource();
    $db->begin();
    try {
      $result = $db->execute("DELETE a FROM $table a JOIN $tableForJoin b ON a.{$columnKey} = b.id WHERE $columnCond = :$columnCond", [$value]);
      $db->commit();
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", $e);
      // $error->addStatusAndError("DBError", "message", "削除に失敗しました[code:108]");
      $error->throwErrors();
    }
  }

  public static function deleteAll($table, $columnName, $cond)
  {
    $db = new DataSource();
    $db->begin();
    try {
      $result = $db->execute("DELETE FROM $table WHERE $columnName = :$columnName", [$cond]);
      $db->commit();
      return $result;
    } catch (\Exception $e) {
      $db->rollback();
      $error = new ErrorHandler();
      $error->addStatusAndError("DBError", "message", "削除に失敗しました[code:109]");
      $error->throwErrors();
    }
  }
}