<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../models/Category.php";
require_once __DIR__ . "/../models/Rule.php";
require_once __DIR__ . "/../models/Routine.php";
require_once __DIR__ . "/../models/Player.php";
require_once __DIR__ . "/../models/Team.php";
require_once __DIR__ . "/../models/Order.php";
require_once __DIR__ . "/../models/Score.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Competition;
use model\Category;
use model\Rule;
use model\Routine;
use model\Player;
use model\Team;
use model\Order;
use model\Score;
use errorhandler\ErrorHandler;

class CompetitionController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getCompetition($competitionId)
  {
    $this->checkCompetition( $competitionId);

    $competition = Competition::getById($competitionId);

    if (!$competition) {
      $this->error->throwCompetitionNotFound();
    }

    $currentCategories = Category::getAll($competitionId);
    $categories = $currentCategories;
    $rules = Rule::getAll($competitionId);
    $routines = Routine::getAll($competitionId);
    $individualPlayers = Player::getCategorizedByType($competitionId, "individual");
    $syncronizedPlayers = Player::getCategorizedByType($competitionId, "syncronized");

    $categoryIds = $currentCategories ? array_map(function ($category) {
      return $category["id"];
    }, $currentCategories) : [];

    $teams = Team::getAll($competitionId);
    $orders = Order::getAll($categoryIds);
    $scores = Score::getAll($categoryIds);

    $responseData = [
      "info" => $competition,
      "categories" => $categories,
      "rules" => $rules,
      "routines" => $routines,
      "players" => [
        "individual" => $individualPlayers,
        "syncronized" => $syncronizedPlayers
      ],
      "teams" => $teams,
      "orders" => $orders,
      "scores" => $scores,
    ];

    echo json_encode(["status" => "success", "data" => $responseData]);
  }

  public function getCompetitions($userId)
  {
    $this->checkUser($userId);

    $competitions = Competition::getAll($userId);

    if (!$competitions) {
      $this->error->throwCompetitionNotFound();
    }

    echo json_encode(["status" => "success", "data" => $competitions]);
  }

  public function createCompetition($userId)
  {
    $this->checkUser($userId);

    $this->data["user_id"] = $userId;
    
    $result = Competition::create($this->data);
    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      $this->error->throwPostFailure();
    }
  }

  public function updateCompetition($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Competition::patch($this->data, $competitionId);
    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      $this->error->throwPatchFailure();
    }
  }

  public function deleteCompetition($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $result = Competition::del($competitionId);
    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      $this->error->throwDeleteFailure();
    }
  }
}