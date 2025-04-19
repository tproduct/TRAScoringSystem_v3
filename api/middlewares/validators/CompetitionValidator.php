<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class CompetitionValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function createCompetition()
  {
    parent::setRules([
      "type" => ["type" => "string" ,"required" => true],
      "name" => ["type" => "string", "max" => 20 ,"required" => true],
      "date_from" => ["type" => "date" ,"required" => true],
      "date_to" => ["type" => "date" ,"required" => true],
      "venue" => ["type" => "string", "max" => 20 ,"required" => true],
      "panels" => ["type" => "integer" ,"required" => true],
      "num_e" => ["type" => "integer" ,"required" => true],
      "team_by_cat" => ["type" => "boolean"],
      "read_d" => ["type" => "boolean"],
      "read_h" => ["type" => "boolean"],
      "read_t" => ["type" => "boolean"],
      "full_d" => ["type" => "boolean"],
      "full_h" => ["type" => "boolean"],
      "full_t" => ["type" => "boolean"],
    ]);
  }

  public function updateCompetition()
  {
    parent::setRules([
      "type" => ["type" => "enum", "list" => ["TRA", "DMT", "TUM"], "required" => true],
      "name" => ["type" => "string", "max" => 50, "required" => true],
      "date_from" => ["type" => "date", "required" => true],
      "date_to" => ["type" => "date", "required" => true],
      "venue" => ["type" => "string", "max" => 50, "required"=> true],
      "panels" => ["type" => "enum", "list" => [1,2,3], "required" => true],
      "num_e" => ["type" => "enum", "list" => [1,2,3,4,5,6], "required" => true],
      "team_by_cat" => ["type" => "boolean"],
      "read_d" => ["type" => "boolean"],
      "read_h" => ["type" => "boolean"],
      "read_t" => ["type" => "boolean"],
      "full_d" => ["type" => "boolean"],
      "full_h" => ["type" => "boolean"],
      "full_t" => ["type" => "boolean"],
    ]);
  }

}