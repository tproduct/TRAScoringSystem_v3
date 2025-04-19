<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Rule.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Rule;
use controller\BaseController;
use errorhandler\ErrorHandler;

class RuleController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function syncRuleAll($userId, $competitionId, $round)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Rule::syncData($this->data, $competitionId,$round);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwSyncFailure();
    }
  }
}