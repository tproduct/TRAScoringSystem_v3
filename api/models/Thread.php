<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Thread extends Model
{
  public static function getAll()
  {
    return parent::fetchAll("SELECT t.id AS id, title, t.created_at, t.updated_at, message, t.user_id, name FROM threads t JOIN users u ON t.user_id = u.id ORDER BY t.id DESC", []);
  }

  public static function create($data)
  {
    return parent::insert("threads", $data);
  }

  public static function patch($data, $threadId){
    return parent::update("threads", $data, $threadId);
  }

  public static function del($threadId){
    return parent::delete("threads", $threadId);
  }
}