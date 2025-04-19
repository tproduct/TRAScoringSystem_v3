<?php
namespace validator;

require_once __DIR__ . "/../../error/ErrorHandler.php";
use errorhandler\ErrorHandler;
use DateTime;

class Validator
{
  private $data;
  private $rules = [];
  private $errors;

  public function __construct()
  {
    $this->errors = new ErrorHandler();
    $data = $this->checkInput(json_decode(file_get_contents('php://input'), true));
    foreach ($data as $key => $value)
      $this->data[$key] = $this->sanitize($key, $value);
    $this->data = self::escapeArray($this->data);
  }

  protected function sanitize($key, $value)
  {
    if (is_array($value)) {
      return array_map(fn($item) => is_array($item) ? $this->sanitizeArray($item) : $this->sanitize($key, $item), $value);
    }

    return match (true) {
      is_null($value) => null,
      is_bool($value) => $value, // booleanはそのまま返す
      $key === "email" => filter_var(trim($value), FILTER_SANITIZE_EMAIL),
      is_numeric($value) => strpos($value, '.') === false ? (int) $value : (float) $value,
      default => trim($value),
    };
  }

  protected function sanitizeArray($array)
  {
    foreach ($array as $key => $value) {
      $array[$key] = $this->sanitize($key, $value);
    }
    return $array;
  }

  public function setRules($rules)
  {
    $this->rules = $rules;
  }

  public function validate()
  {
    $this->errors->setErrors(self::validateArray($this->data, $this->rules));
    if ($this->errors->hasErrors()) {
      $this->errors->setStatus("invalid");
      $this->errors->throwErrors();
      exit;
    }
    return $this->data;
  }

  private function checkInput($var)
  {
    // NULLの場合は何もしない
    if (is_null($var))
      return null;

    if (is_array($var)) {
      return array_map([self::class, 'checkInput'], $var);
    }

    // NULLバイト攻撃対策
    if (preg_match('/\0/', $var)) {
      $this->errors->addStatusAndError("invalid","input", "不正な入力です[code:201]");
      $this->errors->throwErrors();
    }

    // 文字エンコードのチェック
    if (!mb_check_encoding($var, 'UTF-8')) {
      $this->errors->addStatusAndError("invalid","input", "不正な入力です[code:202]");
      $this->errors->throwErrors();
    }

    // 改行、タブ以外の制御文字のチェック
    if (preg_match('/\A[\r\n\t[:^cntrl:]]*\z/u', $var) === 0) {
      $this->errors->addStatusAndError("invalid","input", "不正な入力です。制御文字は使用できません。[code:203]");
      $this->errors->throwErrors();
    }

    // サイズ制限 (例: 最大10,000文字)
    $maxLength = 10000;
    if (strlen($var) > $maxLength) {
      $this->errors->addStatusAndError("invalid","input", "不正な入力です。文字数が多すぎます。[code:204]");
      $this->errors->throwErrors();
    }

    return $var;
  }


  private static function escapeArray($data)
  {
    if (is_array($data)) {
      $escaped = [];
      foreach ($data as $key => $value) {
        $escaped[$key] = self::escapeArray($value); // 再帰処理
      }
      return $escaped;
    } elseif (is_string($data)) {
      return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    } else {
      return $data; // 文字列以外はそのまま返す
    }
  }

  private static function validateArray(array $data, array $rules): array
  {
    $errors = [];

    if (!isAssoc($data)) {
      $escaped = [];
      foreach ($data as $key => $value) {
        $escaped[$key] = self::validateArray($value, $rules);
      }
      return $escaped;
    }

    foreach ($rules as $key => $rule) {
      if (!array_key_exists($key, $data)) {
        if (!empty($rule['required'])) {
          $errors[$key] = "必須項目です";
        }
        continue; // 次のキーへ
      }

      $value = $data[$key];

      // 文字列チェック
      if (!empty($rule['type']) && $rule['type'] === 'string' && !is_string($value)) {
        $errors[$key] = "文字列にしてください";
        continue;
      }

      // 数値チェック（整数）
      if (!empty($rule['type']) && $rule['type'] === 'integer' && !is_int($value)) {
        $errors[$key] = "整数にしてください";
        continue;
      }

      // 最大値チェック（整数）
      if (!empty($rule['maxNumber']) && $value > $rule['maxNumber']) {
        $errors[$key] = "{$rule['maxNumber']}以下にしてください";
        continue;
      }

      // 最小値チェック（整数）
      if (!empty($rule['minNumber']) && $value < $rule['minNumber']) {
        $errors[$key] = "{$rule['minNumber']}以上にしてください";
        continue;
      }

      // スコアチェック
      if (!empty($rule['type']) && $rule['type'] === 'score' && !is_numeric($value) && !is_null($value)) {
        $errors[$key] = "実数にしてください";
        continue;
      }

      // E-mailチェック
      if (!empty($rule['type']) && $rule['type'] === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        $errors[$key] = "不正なE-mailアドレスの形式です";
        continue;
      }

      // パスワードチェック
      if (!empty($rule['type']) && $rule['type'] === 'password' && !preg_match("/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/", $value)) {
        $errors[$key] = "パスワードは８〜１６文字以上の半角英数字（大文字、数字を各１文字以上含む）にしてください";
        continue;
      }

      // 最大文字数チェック
      if (!empty($rule['max']) && is_string($value) && mb_strlen($value) > $rule['max']) {
        $errors[$key] = "{$rule['max']}文字以内にしてください";
      }

      // 日付チェック
      if (!empty($rule['type']) && $rule['type'] === "date" && !self::validateDate($value)) {
        $errors[$key] = "不正な日付形式です";
      }

      if (!empty($rule['type']) && $rule['type'] === "enum" && !in_array($value, $rule["list"])){
        $errors[$key] = implode(",", $rule["list"])."のいずれかにしてください";
      }

      // booleanチェック
      if (!empty($rule['type']) && $rule['type'] === "boolean" && !is_null($value) && !is_bool($value)) {
        $errors[$key] = "不正な型です";
      }

      // ネストされた配列のチェック
      if (!empty($rule['type']) && $rule['type'] === 'array' && is_array($value)) {
        if (!empty($rule['schema'])) {
          $nestedErrors = self::validateArray($value, $rule['schema']);
          if (!empty($nestedErrors)) {
            $errors[$key] = $nestedErrors;
          }
        }
      }
    }

    return $errors;
  }

  private static function validateDate($date, $format = "Y-m-d")
  {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
  }

}

