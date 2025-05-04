<?PHP
function splitArrayKeys(array $array, string $delimiter = '-'): array
{
  $result = [];

  foreach ($array as $key => $value) {
    if ($value) {
      $result[] = explode($delimiter, $key);
    }
  }

  return $result;
}

function convertToNestedArray($input) {
  $result = [];
  
  foreach ($input as $key => $value) {
      // "e1s1" のようなキーを分割
      if (preg_match('/^(e\d+|med)(s\d+|lnd|sum)$/', $key, $matches)) {
          $event = $matches[1];
          $subKey = $matches[2];
          
          // 初めてのキーの場合は初期化
          if (!isset($result[$event])) {
              $result[$event] = [];
          }
          
          $result[$event][$subKey] = $value;
      }
  }

  return $result;
}

function every($array, $callback) {
  foreach ($array as $key => $value) {
      if (!$callback($value, $key)) {
          return false;
      }
  }
  return true;
}

function some($array, $callback) {
  foreach ($array as $key => $value) {
      if ($callback($value, $key)) {
          return true;
      }
  }
  return false;
}

function isAssoc(array $arr): bool
{
  return array_keys($arr) !== range(0, count($arr) - 1);
}

function isNestedAssoc($array) {
  if (!is_array($array)) {
      return false;
  }

  // 配列の要素をチェック
  foreach ($array as $value) {
      if (is_array($value) && array_values($value) !== $value) {
          return true; // 連想配列がネストされている
      }
  }

  return false;
}

function replaceEmptyWithNull($array) {
  foreach ($array as $key => $value) {
      if (is_array($value)) {
          // 再帰的に処理
          $array[$key] = replaceEmptyWithNull($value);
      } elseif ($value === "") {
          // 空文字の場合はNULLに置き換え
          $array[$key] = null;
      }
  }
  return $array;
}

function ensureKeys(array $data, array $keys) {
  $result = [];
  foreach ($keys as $key) {
      $result[$key] = array_key_exists($key, $data) ? $data[$key] : null;
  }
  return $result;
}

function setValuesToNull($array) {
  foreach ($array as $key => $value) {
      if (is_array($value)) {
          // ネストされた連想配列の場合、再帰的に処理
          $array[$key] = setValuesToNull($value);
      } else {
          // 値をNULLに設定
          $array[$key] = NULL;
      }
  }
  return $array;
}

function generateUniqueRandomArray($max, $min = 1) {
  // 範囲内のすべての整数を配列にする
  $range = range($min, $max);

  // 配列をシャッフルして順番をランダムに
  shuffle($range);

  return $range;
}

function countByKeyValue(array $array, string $key, $value): int {
  return count(array_filter($array, function($item) use ($key, $value) {
      return isset($item[$key]) && $item[$key] === $value;
  }));
}
