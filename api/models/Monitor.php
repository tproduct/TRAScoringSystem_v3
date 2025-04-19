<?php
namespace model;
require_once __DIR__ . "/Model.php";

use model\Model;

class Monitor extends Model
{
  public static function getById($monitorId)
  {
    return parent::fetch("SELECT * FROM monitors WHERE id = ?", [$monitorId]);
  }

  public static function create($data)
  {
    $data['id'] = uniqid("mnt_");

    return parent::insert("monitors", $data);
  }

  public static function patch($data, $monitorId){
    return parent::update("monitors", $data, $monitorId);
  }
}