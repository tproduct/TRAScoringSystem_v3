<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Routine.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Routine;
use controller\BaseController;
use errorhandler\ErrorHandler;

class RoutineController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function syncRoutineAll($userId, $competitionId, $round)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Routine::syncData($this->data, $competitionId,$round);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwSyncFailure();
    }
  }
}