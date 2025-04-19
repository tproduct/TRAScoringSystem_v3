<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Category.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Category;
use controller\BaseController;
use errorhandler\ErrorHandler;

class CategoryController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getCaegoryAll($userId, $competitionId, $categoryId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Category::getAll($competitionId);

    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function syncCategoryAll($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Category::syncData($this->data, $competitionId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwSyncFailure();
    }
  }

  public function deleteCategoryAll($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Category::del( $competitionId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      $this->error->throwDeleteFailure();
    }
  }

}