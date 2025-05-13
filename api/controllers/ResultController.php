<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../models/Category.php";
require_once __DIR__ . "/../models/Rule.php";
require_once __DIR__ . "/../models/Result.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . "/../log/Log.php";

use Log;
use model\Competition;
use model\Category;
use model\Rule;
use model\Result;
use errorhandler\ErrorHandler;

class ResultController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getResult($competitionId, $type, $gender, $categoryId, $round, $routine)
  {
    $competition = Competition::getById($competitionId);
    $compType = $competition["type"];
    
    $category = Category::getById($categoryId);
    $rounds = $category["rounds"];

    if (!$competition) {
      Log::system("competition not found[result]", $competitionId);

      $this->error->throwCompetitionNotFound();
    }

    $rule = Rule::getByRoundAndCategory($competitionId, $round, $categoryId);

    switch ($round) {
      case "qualify":
        $result = $rule["is_total"]
          ? Result::getQualifyResultByTotal($compType, $type, $gender, $categoryId)
          : Result::getQualifyResultByBest($compType,$type, $gender, $categoryId);
        break;
      case "semifinal":
        $result = $compType === "TRA"
          ? Result::getSemifinalResultOfTRA($type, $gender, $categoryId)
          : Result::getSemifinalResultOfDMT($type, $gender, $categoryId);
        break;
      case "final":
        switch($compType){
          case "TRA":
            $result = Result::getFinalResultOfTRA($type,$gender,$categoryId, $rounds > 1 && $rule["refresh"]);
            break;
          default:
            $result = Result::getFinalResultOfDMT($type,$gender,$categoryId, $routine);
            break;
        }
        break;
    }

    if (!$result) {
      Log::system("result not found[result]", $competitionId);

      $this->error->throwResultNotFound();
    }

    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function getTeamResult($competitionId, $gender){
    $this->getTeamResultByCategory($competitionId, $gender, null);
  }

  public function getTeamResultByCategory($competitionId, $gender, $categoryId){
    $competition = Competition::getById($competitionId);
    $teamByCat = $competition["team_by_cat"];
    $teamRoutines = $competition["team_routines"];

    $result = Result::getTeamResult($gender, $competitionId, $categoryId, $teamByCat, $teamRoutines);

    echo json_encode(["status" => "success", "data" => $result]);
  }

}