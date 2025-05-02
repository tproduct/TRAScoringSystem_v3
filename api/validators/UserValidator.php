<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class UserValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function createUser()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 20, "required" => true],
      "email" => ["type" => "email", "required" => true],
      "password" => ["type" => "password", "required" => true],
      "confirm" => ["type" => "password", "required" => true],
      "inviteCode" => ["type" => "string", "required" => true],
      "organization" => ["type" => "string", "max" => 50,"required" => false],
    ]);
  }
  
  public function updateUser()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 20, "required" => true],
      "email" => ["type" => "email", "required" => true],
      "organization" => ["type" => "string", "required" => false],
    ]);
  }

  public function updateAllUser()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 10, "required" => true],
      "email" => ["type" => "email", "required" => true],
      "organization" => ["type" => "string", "required" => false],
    ]);
  }

}