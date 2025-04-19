<?php
namespace controller;
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\User;
use model\Competition;
use errorhandler\ErrorHandler;

class BaseController {
  
  public function checkUser($userId){
    $result = User::getById($userId);
    if (!$result) {
      $error = new ErrorHandler();
      $error->throwUserNotFound();
    }
  }

  public function checkCompetition($competitionId){
    $result = Competition::getById($competitionId);

    if (!$result) {
      $error = new ErrorHandler();
      $error->throwCompetitionNotFound();
    }
  }

  public function checkUserAndCompetition($userId, $competitionId){
    $this->checkUser($userId);
    $this->checkCompetition($competitionId);
  }
}