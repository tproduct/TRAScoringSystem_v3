<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Order.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . "/../log/Log.php";

use Log;
use model\Order;
use model\Competition;
use errorhandler\ErrorHandler;

class OrderController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getOrder($userId, $competitionId, $type, $gender, $categoryId, $round)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Order::getOrder($categoryId, $type, $round, $gender);

    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function syncOrder($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $competition = Competition::getById($competitionId);
    $compType = $competition["type"];

    $result = Order::syncData($compType, $competitionId, $this->data);

    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      Log::system("sync error[order]", $competitionId);

      $this->error->throwSyncOrderFailure();
    }
  }

  
}