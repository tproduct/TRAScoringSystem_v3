<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class RoutineValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncRoutineAll()
  {
    parent::setRules([
      "number" => ["type" => "enum", "list" => [1,2], "required" => true],
      "has_d" => ["type" => "boolean"],
      "has_h" => ["type" => "boolean"],
      "has_t" => ["type" => "boolean"],
    ]);
  }

}