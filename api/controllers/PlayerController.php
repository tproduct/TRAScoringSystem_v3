<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Player.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Player;
use controller\BaseController;
use errorhandler\ErrorHandler;

class PlayerController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  private function syncPlayerAll($userId, $competitionId, $type)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Player::syncData($this->data, $competitionId,$type);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwSyncFailure();
    }
  }

  public function syncIndividualPlayerAll($userId, $competitionId){
    $this->syncPlayerAll($userId, $competitionId, "individual");
  }

  public function syncSyncronizedPlayerAll($userId, $competitionId){
    $this->syncPlayerAll($userId, $competitionId, "syncronized");
  }

  private function deletePlayerAll($userId, $competitionId, $type)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Player::delAll($competitionId, $type);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      $this->error->throwDeleteFailure();
    }
  }

  public function deleteIndividualPlayerAll($userId, $competitionId)
  {
    $this->deletePlayerAll($userId, $competitionId,"individual");
  }

  public function deleteSyncronizedPlayerAll($userId, $competitionId)
  {
    $this->deletePlayerAll($userId, $competitionId,"syncronized");
  }
}