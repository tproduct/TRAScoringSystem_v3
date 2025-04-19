<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class MonitorValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function createMonitor()
  {
    parent::setRules([
      "interval_time" => ["type" => "integer", "minNumber" => 1, "maxNumber" => 10, "required" => true],
      "group_size" => ["type" => "integer", "minNumber" => 5,"maxNumber" => 15, "required" => true],
    ]);
  }

  public function updateMonitor()
  {
    parent::setRules([
      "interval_time" => ["type" => "integer", "minNumber" => 1, "maxNumber" => 10, "required" => true],
      "group_size" => ["type" => "integer", "minNumber" => 5,"maxNumber" => 15, "required" => true],
    ]);
  }

}