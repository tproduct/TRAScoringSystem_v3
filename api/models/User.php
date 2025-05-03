<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class User extends Model
{
  public static function getById($userId)
  {
    return parent::fetch("SELECT id, email, name, organization, role FROM users WHERE id = ?", [$userId]);
  }

  public static function getByEmail($email)
  {
    return parent::fetch("SELECT id, email, name, organization, role FROM users WHERE email = ?", [$email]);
  }

  public static function getMonitor($userId)
  {
    return parent::fetch("SELECT * FROM monitors WHERE user_id = ?", [$userId]);
  }

  public static function create($data)
  {
    $data['id'] = uniqid("user_");

    return parent::insertToOtherTables(["users" => $data, "monitors" => [
      "user_id" => $data["id"],
      "switch_time" => 10,
      "interval_time" => 2,
      "group_size" => 10,
    ]]);
  }

  public static function patch($data, $userId){
    return parent::update("users", $data, $userId);
  }

  public static function del($userId){
    return parent::delete("users", $userId);
  }
}