<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class MessageValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function createMessage()
  {
    parent::setRules([
      "user_id" => ["type" => "string", "required" => true],
      "message" => ["type" => "string","max" => "500", "required" => true],
    ]);
  }

  public function updateMessage()
  {
    parent::setRules([
      "message" => ["type" => "string","max" => "500", "required" => true],
    ]);
  }
  
}