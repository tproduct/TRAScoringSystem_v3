<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Auth extends Model
{
  public static function getByToken($refreshToken)
  {
    return parent::fetch("SELECT user_id FROM refresh_tokens WHERE token = :token AND expires_at > NOW()", [":token" => $refreshToken]);
  }

  public static function create($data)
  {
    return parent::insert("refresh_tokens", $data);
  }

}