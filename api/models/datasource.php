<?php

namespace db;

use PDO;

class DataSource
{
  private $pdo;
  private $sqlResult;

  public function __construct()
  {
    $this->pdo = new PDO(
      "mysql:dbname=" . $_ENV["DB_NAME"] . ";host=" . $_ENV["DB_HOST"],
      $_ENV["DB_USER"],
      $_ENV["DB_PASSWORD"],
      [
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
      ]
    );
  }

  public function select($sql = "", $params = [])
  {
    $stmt = $this->executeSql($sql, $params);
    return $stmt->fetchAll();
  }

  public function selectOne($sql = "", $params = [])
  {
    $result = $this->select($sql, $params);
    return (isset($result[0])) ? $result[0] : false;
  }

  public function execute($sql, $params = [])
  {
    $this->executeSql($sql, $params);
    return $this->sqlResult;
  }

  public function begin()
  {
    $this->pdo->beginTransaction();
  }

  public function commit()
  {
    $this->pdo->commit();
  }

  public function rollback()
  {
    $this->pdo->rollback();
  }

  private function executeSql($sql, $params)
  {
    $stmt = $this->pdo->prepare($sql);
    $this->sqlResult = $stmt->execute($params);
    return $stmt;
  }

  public function close()
  {
    $this->pdo = null;
  }
}