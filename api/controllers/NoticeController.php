<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Notice.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Notice;
use errorhandler\ErrorHandler;

class NoticeController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getAll()
  {
    $result = Notice::getAll();
    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function createNotice()
  {
    $result = Notice::create($this->data);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPostFailure();
    }
  }

  public function updateNotice($noticeId)
  {
    $result = Notice::patch($this->data, $noticeId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPatchFailure();
    }
  }

  public function deleteUser($noticeId)
  {
    $result = Notice::del( $noticeId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      $this->error->throwDeleteFailure();
    }
  }
}