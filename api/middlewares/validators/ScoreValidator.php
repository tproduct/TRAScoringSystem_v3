<?php
namespace validator;
require_once __DIR__ . "/Validator.php";
use validator\Validator;

class ScoreValidator extends Validator
{
  private $data;
  private $errors = [];

  private $formNames = [];
  private $judgeNames = [];

  public function __construct()
  {
    parent::__construct();
    $this->formNames = array_map(function($judge){
      return array_map(function($field) use($judge){
        return ["{$judge}{$field}" => ["type" => "score"]];
      }, ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "lnd", "sum"]);
    }, ["e1", "e2", "e3", "e4", "e5", "e6", "med"]);

    $this->judgeNames = array_map(function($judge){
      return [ "{$judge}judge" => ["type" => "string"]];
    },["e1", "e2", "e3", "e4", "e5", "e6", "med"]);
  }

  public function createScore()
  {
    parent::setRules(array_merge([
      "exe" => ["type" => "score"],
      "diff" => ["type" => "score"],
      "hd" => ["type" => "score"],
      "time" => ["type" => "score"],
      "pen" => ["type" => "score"],
      "sum" => ["type" => "score"],
      "maxmark" => ["type" => "integer"],
      "is_changed" => ["type" => "boolean"],
      "dns" => ["type" => "boolean"],
    ], $this->formNames, $this->judgeNames));
  }

  public function updateScore()
  {
    parent::setRules(array_merge([
      "exe" => ["type" => "score"],
      "diff" => ["type" => "score"],
      "hd" => ["type" => "score"],
      "time" => ["type" => "score"],
      "pen" => ["type" => "score"],
      "sum" => ["type" => "score"],
      "maxmark" => ["type" => "integer"],
      "is_changed" => ["type" => "boolean"],
      "dns" => ["type" => "boolean"],
    ], $this->formNames, $this->judgeNames));
  }

}