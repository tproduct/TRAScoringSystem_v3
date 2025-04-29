<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Score.php";
require_once __DIR__ . "/../models/Category.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Category;
use model\Score;
use errorhandler\ErrorHandler;

class ScoreController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getExtractedScore($competitionId, $gender, $scoreType, $rounds)
  {
    // $this->checkUserAndCompetition($userId, $competitionId);
    $result = Score::getScoreAndPlayer($competitionId, $gender, $scoreType, $rounds);

    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }

  }

  public function createScore($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $scoreData = $this->generateRequestScoreData($this->data);

    $nestedEScoreData = convertToNestedArray($this->data);
    $eScoreData = $this->data["dns"] ? setValuesToNull($nestedEScoreData) : $nestedEScoreData;

    $result = Score::create($scoreData, $eScoreData);

    if ($result) {
      $scores = $this->generateResponseData($competitionId);
      echo json_encode(["status" => "success", "data" => $scores]);
    } else {
      $this->error->throwPostFailure();
    }
  }

  public function updateScore($userId, $competitionId, $scoreId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);
    $scoreData = $this->generateRequestScoreData($this->data);

    $nestedEScoreData = convertToNestedArray($this->data);

    //送られてきていないスキルはNULLにする
    $eScoreData = array_reduce(array_keys($nestedEScoreData), function($carry, $key) use($nestedEScoreData){
      return array_merge($carry, [ "{$key}" => ensureKeys($nestedEScoreData[$key],["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","lnd"])]);
    },[]);

    $eScoreIds = array_reduce(array_keys($eScoreData), function($carry, $key){
      return array_merge( $carry, [ "{$key}" => $this->data["{$key}escore_id"]]);
    }, []);

    $result = Score::patchAll($scoreData, $scoreId, $eScoreData, $eScoreIds);
    if ($result) {
      $scores = $this->generateResponseData($competitionId);
      echo json_encode(["status" => "success", "data" => $scores]);
    } else {
      $this->error->throwPatchFailure();
    }
  }

  public function deleteScore($userId, $competitionId, $scoreId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Score::del($scoreId);
    if ($result) {
      $response = $this->generateResponseData($competitionId);
      echo json_encode(["status" => "success", "data" => $response]);
    } else {
      $this->error->throwDeleteFailure();
    }
  }

  private function generateRequestScoreData($data)
  {
    return $data["dns"] ? [
      "order_id" => $data["order_id"],
      "dns" => $data["dns"],
    ] : [
      "order_id" => $data["order_id"],
      "exe" => $data["exe"],
      "diff" => $data["diff"],
      "hd" => $data["hd"],
      "time" => $data["time"],
      "pen" => $data["pen"],
      "sum" => $data["sum"],
      "maxmark" => $data["maxmark"],
      "is_changed" => $data["is_changed"],
      "dns" => $data["dns"],
    ];
  }

  private function generateResponseData($competitionId)
  {
    $currentCategories = Category::getAll($competitionId);
      $categoryIds = $currentCategories ? array_map(function ($category) {
        return $category["id"];
      }, $currentCategories) : [];
    return Score::getAll($categoryIds);
  }
}