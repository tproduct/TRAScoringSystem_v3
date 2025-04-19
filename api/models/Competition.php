<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Competition extends Model
{
  public static function getById($competitionId)
  {
    return parent::fetch("SELECT * FROM competitions WHERE id = ?", [$competitionId]);
  }

  public static function getAll($userId){
    return parent::fetchAll("SELECT * FROM competitions WHERE user_id = ?", [$userId]);
  }

  public static function create($data)
  {
    $data['id'] = uniqid("comp_");

    return parent::insert("competitions", $data);
  }

  public static function patch($data, $competitionId){
    return parent::update("competitions", $data, $competitionId);
  }

  public static function del($competitionId){
    return parent::delete("competitions", $competitionId);
  }
}