<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . '/../log/Log.php';

use model\User;
use errorhandler\ErrorHandler;
use Log;

class LogController extends BaseController
{
  private $error;

  public function __construct()
  {
    $this->error = new ErrorHandler();
  }

  public function getAll($userId, $category, $year, $month, $date)
  {
    $user = User::getById($userId);

    if (!$user) {
      $this->error->throwUserNotFound();
    }

    if ($user["role"] !== "admin") {
      Log::auth("Invalid role", $userId);
      $this->error->addStatusAndError("unauthorized", "message", "権限がありません");
      $this->error->throwErrors();
    }

    // ログファイルのパス構築
    $logFile = __DIR__ . "/../log/logs/$year/$month/$category-$date.log";

    if (!file_exists($logFile)) {
      echo json_encode(['error' => 'Log file not found']);
      exit;
    }

    // ログファイルの中身を1行ずつ読み込んでJSONとして返す
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $entries = array_map('json_decode', $lines);

    echo json_encode([
      // 'date' => "$year-$month-$day",
      // 'category' => $category,
      'entries' => $entries
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
  }
}