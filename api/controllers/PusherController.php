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

  public function sendScoreFromJudge($competitionId, $panel)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId.$panel, 'sendScore', $this->data);
    echo json_encode(["status" => "success"]);
  }

  public function sendMaxMarkFromSystem($competitionId, $panel)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId.$panel, 'sendMaxMark', $this->data["maxMark"]);
  }

  public function sendIsReadingFromSystem($competitionId, $panel)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId.$panel, 'sendIsReading', $this->data["isReading"]);
  }

  public function sendMonitorFromSystem($competitionId, $panel)
  {
    $this->pusher->trigger($_ENV['PUSHER_CHANNEL'].$competitionId.$panel, 'sendMonitor', $this->data);
  }
}