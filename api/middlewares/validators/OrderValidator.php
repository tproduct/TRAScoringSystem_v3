<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class OrderValidator extends Validator
{
  private $data;
  private $errors = [];

  public function __construct()
  {
    parent::__construct();
  }

  public function syncOrder()
  {
    parent::setRules([]);
  }

}