<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Auth extends Model
{
  public static function getByUserId($userId)
  {
    return parent::fetch("SELECT * FROM refresh_tokens WHERE user_id = ?", [$userId]);
  }

  public static function create($data)
  {
    return parent::insert("refresh_tokens", $data);
  }

}