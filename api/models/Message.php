<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Message extends Model
{
  public static function getByThreadId($threadId)
  {
    return parent::fetchAll("SELECT m.id AS id, message, m.created_at, m.updated_at, name FROM messages m JOIN users u ON m.user_id = u.id WHERE thread_id = ? ORDER BY m.id DESC", [$threadId]);
  }

  public static function getAll()
  {
    return parent::fetchAll("SELECT * FROM messages", []);

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