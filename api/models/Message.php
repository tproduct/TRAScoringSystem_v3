<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Message extends Model
{
  public static function getByThreadId($threadId)
  {
    return parent::fetchAll("SELECT m.id AS id, message, m.created_at, m.updated_at, m.user_id, name FROM messages m JOIN users u ON m.user_id = u.id WHERE thread_id = ? ORDER BY m.id DESC", [$threadId]);
  }

  public static function getAll()
  {
    return parent::fetchAll("SELECT * FROM messages", []);

  }

  public static function create($data)
  {
    return parent::insert("messages", $data);
  }

  public static function patch($data, $messageId){
    return parent::update("messages", $data, $messageId);
  }

  public static function del($messageId){
    return parent::delete("messages", $messageId);
  }
}