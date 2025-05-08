<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class AuthValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function userLogin()
  {
    parent::setRules([
      "email" => ["type" => "email", "required" => true],
      "password" => ["type" => "password", "required" => true],
    ]);
  }

  public function judgeLogin()
  {
    parent::setRules([
      "competitionId" => ["type" => "string", "required" => true],
      "password" => ["type" => "password", "required" => true],
    ]);
  }

}