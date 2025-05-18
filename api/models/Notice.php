<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Notice extends Model
{
  public static function getAll()
  {
    return parent::fetchAll("SELECT * FROM notices WHERE expires_at > NOW() ORDER BY created_at DESC", []);
  }

  public static function create($data)
  {
    return parent::insert("notices", $data);
  }

  public static function patch($data, $noticeId){
    return parent::update("notices", $data, $noticeId);
  }

  public static function del($noticeId){
    return parent::delete("notices", $noticeId);
  }
}