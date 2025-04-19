<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class User extends Model
{
  public static function getById($userId)
  {
    return parent::fetch("SELECT * FROM users WHERE id = ?", [$userId]);
  }

  public static function getByEmail($email)
  {
    return parent::fetch("SELECT * FROM users WHERE email = ?", [$email]);

  }

  public static function create($data)
  {
    $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    $data['id'] = uniqid("user_");

    return parent::insert("users", $data);
  }

  public static function patch($data, $userId){
    return parent::update("users", $data, $userId);
  }

  public static function del($userId){
    return parent::delete("users", $userId);
  }
}