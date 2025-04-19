<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class CategoryValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncCategoryAll()
  {
    parent::setRules([
      "name" => ["type" => "string", "max" => 20, "required" => true],
      "rounds" => ["type" => "enum", "list" => [1, 2, 3], "required" => true],
      "has_mix" => ["type" => "boolean"],
    ]);
  }

}