<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class ThreadValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function createThread()
  {
    parent::setRules([
      "user_id" => ["type" => "string", "required" => true],
      "title" => ["type" => "string", "max" => "50",  "required" => true],
      "message" => ["type" => "string","max" => "500", "required" => true],
    ]);
  }

  public function updateThread()
  {
    parent::setRules([
      "title" => ["type" => "string", "max" => "50",  "required" => true],
      "message" => ["type" => "string","max" => "500", "required" => true],
    ]);
  }
}