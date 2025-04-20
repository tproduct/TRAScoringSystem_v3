<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../models/Thread.php";
require_once __DIR__ . "/../models/Message.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\User;
use model\Thread;
use model\Message;
use errorhandler\ErrorHandler;

class ThreadController extends BaseController
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

  public function createThread($userId)
  {
    $this->checkUser($userId);

    $result = Thread::create($this->data);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPostFailure();
    }
  }

  public function updateThread($userId, $threadId)
  {
    $this->checkUser($userId);
    $this->data["updated_at"] = $now = date('Y-m-d H:i:s');

    $result = Thread::patch($this->data, $threadId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPatchFailure();
    }
  }

  public function deleteThread($userId, $threadId)
  {
    $this->checkUser($userId);

    $result = Thread::del( $threadId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      $this->error->throwDeleteFailure();
    }
  }
}