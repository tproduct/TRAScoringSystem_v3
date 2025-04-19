<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class TeamValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncTeamByCategory()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 50, "required" => true],
    ]);
  }

  public function syncTeam()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 50, "required" => true],
    ]);
  }

}