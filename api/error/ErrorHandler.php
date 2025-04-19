<?php
namespace errorhandler;

class ErrorHandler {
  private $status;
  private $errors = [];

  public function addError($key, $error){
    $this->errors[$key] = $error;
  }

  public function setErrors($errors){
    $this->errors = $errors;
  }

  public function setStatus($status){
    $this->status = $status;
  }

  public function addStatusAndError($status, $key, $error){
    $this->setStatus($status);
    $this->addError($key, $error);
  }

  public function throwErrors(){
    echo json_encode(["status" => $this->status,"errors"=> $this->errors]);
    exit;
  }

  public function hasErrors(){
    return !self::isEmptyOrAllElementsEmptyArrays($this->errors);
  }

  private static function isEmptyOrAllElementsEmptyArrays(array $array): bool
  {
    foreach ($array as $element) {
      if (empty($array)) {
        return true; // 配列が空の場合
      }
      if (!is_array($element) || !empty(array_filter($element))) {
        return false;
      }
    }
    return true;
  }

  public function throwUserNotFound(){
    $this->addStatusAndError("notfound", "message", "ユーザーが存在しません[code:301]");
    $this->throwErrors();
  }

  public function throwCompetitionNotFound(){
    $this->addStatusAndError("notfound", "message", "大会が存在しません[code:303]");
    $this->throwErrors();
  }

  public function throwResultNotFound(){
    $this->addStatusAndError("notfound", "message", "スコアが存在しません[code:303]");
    $this->throwErrors();
  }

  public function throwPostFailure(){
    $this->addStatusAndError("failure", "message", "登録に失敗しました[code:304]");
    $this->throwErrors();
  }

  public function throwPatchFailure(){
    $this->addStatusAndError("failure", "message", "更新に失敗しました[code:305]");
    $this->throwErrors();
  }

  public function throwSyncFailure(){
    $this->addStatusAndError("failure", "message", "同期に失敗しました[code:306]");
    $this->throwErrors();
  }

  public function throwDeleteFailure(){
    $this->addStatusAndError("failure", "message", "削除に失敗しました[code:307]");
    $this->throwErrors();
  }

  public function throwSyncOrderFailure(){
    $this->addStatusAndError("failure", "message", "同期に失敗しました[code:308]");
    $this->throwErrors();
  }
}