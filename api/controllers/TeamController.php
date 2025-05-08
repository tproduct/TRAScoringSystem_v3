<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Team.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . "/../log/Log.php";

use Log;
use model\Team;
use controller\BaseController;
use errorhandler\ErrorHandler;

class TeamController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  // public function getCaegoryAll($userId, $competitionId, $categoryId)
  // {
  //   $this->checkUserAndCompetition($userId, $competitionId);

  //   $result = Category::getAll($competitionId);

  //   echo json_encode(["status" => "success", "data" => $result]);
  // }

  public function syncTeamByCategory($userId, $competitionId, $categoryId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Team::syncDataByCategoryId($this->data, $competitionId, $categoryId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      Log::system("sync error[team by cateogry]", $competitionId);

      $this->error->throwSyncFailure();
    }
  }

  public function syncTeam($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Team::syncDataByCategoryId($this->data, $competitionId, null);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      Log::system("sync error[team]", $competitionId);

      $this->error->throwSyncFailure();
    }
  }

  public function deleteAll($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Team::del( $competitionId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      Log::system("delete error[team]", $competitionId);

      $this->error->throwDeleteFailure();
    }
  }

}