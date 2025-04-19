<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class PlayerValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncIndividualPlayerAll()
  {
    parent::setRules([
      "gender" => ["type" => "enum", "list"=>["men", "women", "mix"], "required" => true],
      "name" => ["type" => "string", "max" => 50, "required" => true],
      "phonetic" => ["type" => "string", "max" => 50, "required" => true],
      "team" => ["type" => "string", "max" => 50, "required" => true],
      "grp" => ["type" => "integer", "required" => true],
      "number" => ["type" => "integer", "required" => true],
      "is_open" => ["type" => "boolean"]
    ]);
  }

  public function syncSyncronizedPlayerAll()
  {
    parent::setRules([
      "gender" => ["type" => "enum", "list"=>["men", "women", "mix"], "required" => true],
      "name" => ["type" => "string", "max" => 50, "required" => true],
      "phonetic" => ["type" => "string", "max" => 50, "required" => true],
      "team" => ["type" => "string", "max" => 50, "required" => true],
      "name2" => ["type" => "string", "max" => 50, "required" => true],
      "phonetic2" => ["type" => "string", "max" => 50, "required" => true],
      "team2" => ["type" => "string", "max" => 50, "required" => true],
      "grp" => ["type" => "integer", "required" => true],
      "number" => ["type" => "integer", "required" => true],
      "is_open" => ["type" => "boolean"]
    ]);
  }

}