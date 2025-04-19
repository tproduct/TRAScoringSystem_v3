<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class RuleValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncRuleAll()
  {
    parent::setRules([
      "routines" => ["type" => "enum", "list" => [1,2], "required" => true],
      "is_total" => ["type" => "boolean"],
    ]);
  }

}