<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . '/../../vendor/autoload.php'; // ComposerでインストールしたPusherのライブラリを読み込み

use Pusher\Pusher;

use controller\BaseController;
use errorhandler\ErrorHandler;

class PusherController extends BaseController
{
  private $data = [];
  private $error;
  private $options;
  private $pusher;

  public function __construct($data)
  {
    $this->data = $data;
    $this->pusher = new Pusher(
      $_ENV['PUSHER_APP_KEY'],
      $_ENV['PUSHER_APP_SECRET'],
      $_ENV['PUSHER_APP_ID'],
      [
        'cluster' => 'ap3',
        'useTLS' => true
      ]
    );
    $this->error = new ErrorHandler();
  }

  public function sendScoreFromJudge($competitionId)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId, 'sendScore', $this->data);
    echo json_encode(["status" => "success"]);
  }

  public function sendMaxMarkFromSystem($competitionId)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId, 'sendMaxMark', $this->data["maxMark"]);
  }

  public function sendIsReadingFromSystem($competitionId)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId, 'sendIsReading', $this->data["isReading"]);
  }

  public function sendMonitorFromSystem($competitionId)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId, 'sendMonitor', $this->data);
  }
}