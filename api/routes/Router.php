<?php
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . "/../token/verifyToken.php";
use errorhandler\ErrorHandler;

class Router
{
  public $routes = [];
  public $authRoutes = [];

  public function addController($method, $path, $controllerAction)
  {
    $this->routes[$method][$path] = $controllerAction;
  }

  public function addAuthMiddleware($method, $path, $roles)
  {
    $this->authRoutes[$method][$path] = $roles;
  }

  public function handleRequest($method, $requestUri)
  {
    $error = new ErrorHandler();

    //メソッドが許可されているか確認
    if (!isset($this->routes[$method])) {
      $error->addStatusAndError("notallowed", "message", "Method is not allowed");
      $error->throwErrors();
      exit;
    }

    //権限の確認
    if (isset($this->authRoutes[$method])) {
      //静的パス
      if (isset($this->authRoutes[$method][$requestUri])) {
        $roles = $this->authRoutes[$method][$requestUri];
        verifyToken($roles);
      }

      //動的パス
      foreach ($this->authRoutes[$method] as $authRoute => $roles) {
        if (strpos($authRoute, '{') === false) {
          continue; // 動的でないルートはスキップ
        }

        $pattern = preg_replace('/\{[^\}]+\}/', '([^/]+)', $authRoute); // `{id}` を `([^/]+)` に置換
        if (preg_match("#^$pattern$#", $requestUri, $matches)) {
          verifyToken($roles);
        }
      }
    }


    // 静的パスを優先して確認
    if (isset($this->routes[$method][$requestUri])) {
      $controllerAction = $this->routes[$method][$requestUri];
      $validated = ($method !== "GET" && $method !== "DELETE") ? $this->callValidator($controllerAction) : null;
      $this->callController($controllerAction, [], $validated);
      return;
    }

    foreach ($this->routes[$method] as $route => $controllerAction) {
      if (strpos($route, '{') === false) {
        continue; // 動的でないルートはスキップ
      }

      $pattern = preg_replace('/\{[^\}]+\}/', '([^/]+)', $route); // `{id}` を `([^/]+)` に置換
      if (preg_match("#^$pattern$#", $requestUri, $matches)) {
        array_shift($matches); // 最初の要素はURL全体なので削除

        $validated = ($method !== "GET" && $method !== "DELETE") ? $this->callValidator($controllerAction) : null;

        $this->callController($controllerAction, $matches, $validated);
        return;
      }
    }

    // すべてのルートに一致しなかった場合
    $error->addStatusAndError("notfound", "message", "Controller is not found");
    $error->throwErrors();
    exit;
  }

  private function callController($controllerAction, $params, $data = null)
  {
    list($controllerName, $method) = explode('@', $controllerAction);
    require_once __DIR__ . "/../controllers/$controllerName.php"; // コントローラを読み込む
    $controllerClass = "\\controller\\$controllerName";
    $controller = new $controllerClass($data);
    call_user_func_array([$controller, $method], $params);
  }

  private function callValidator($controllerAction)
  {
    list($controllerName, $method) = explode('@', $controllerAction);
    $validatorName = str_replace("Controller", "Validator", $controllerName);
    require_once __DIR__ . "/../validators/$validatorName.php"; // コントローラを読み込む
    $validatorClass = "\\validator\\$validatorName";
    $validator = new $validatorClass();
    call_user_func([$validator, $method]);

    $validated = call_user_func([$validator, "validate"]);
    return $validated;
  }
}