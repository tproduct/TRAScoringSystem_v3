<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class PusherValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function sendScoreFromJudge()
  {
    parent::setRules([
      "score" => ["type" => "score"],
    ]);
  }

  public function sendMaxMarkFromSystem()
  {
    parent::setRules([
      "maxMark" => ["type" => "integer"],
    ]);
  }

  public function sendIsReadingFromSystem()
  {
    parent::setRules([
      "isReading" => ["type" => "boolean"],
    ]);
  }

  public function sendMonitorFromSystem()
  {
    parent::setRules([
    ]);
  }
}