<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../models/Thread.php";
require_once __DIR__ . "/../models/Message.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . "/../log/Log.php";

use Log;
use model\Thread;
use model\Message;
use errorhandler\ErrorHandler;

class MessageController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getAll($userId)
  {
    $this->checkUser($userId);

    $threads = Thread::getAll();
    $messages = [];

    foreach ($threads as $thread) {
      $threadId = $thread["id"];
      $messages["thread{$threadId}"] = ["thread" => $thread, "replies" => Message::getByThreadId($threadId)];
    }
    // $result = Message::getAll();

    // if (!$result) {
    //   $this->error->throwUserNotFound();
    // }

    echo json_encode(["status" => "success", "data" => $messages]);
  }

  public function createMessage($userId, $threadId)
  {
    $this->checkUser($userId);

    $result = Message::create($this->data);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      Log::event("system","create error[message]", ["threadId" => $threadId]);

      $this->error->throwPostFailure();
    }
  }

  public function updateMessage($userId, $threadId, $messageId)
  {
    $this->checkUser($userId);
    $this->data["updated_at"] = $now = date('Y-m-d H:i:s');

    $result = Message::patch($this->data, $messageId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      Log::event("system","create error[message]", ["messageId" => $messageId]);

      $this->error->throwPatchFailure();
    }
  }

  public function deleteMessage($userId, $threadId, $messageId)
  {
    $result = Message::del( $messageId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      Log::event("system","create error[message]", ["messageId" => $messageId]);

      $this->error->throwDeleteFailure();
    }
  }
}