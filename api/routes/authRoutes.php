<?php
/**
 * routesに渡すコントローラーとバリデーターの関係
 * controllerAction: コントローラー名@アクション名
 * アクション名がコントローラーとバリデーターのメソッドとなる
 * バリデーターでは、コントローラーのアクション名と同じメソッドでルールを設定する
 * コントローラー名とバリデーター名のprefixは一致させる
 */

//LOGIN
// $router->addAuthMiddleware("POST", "/login", "user");
// $router->addAuthMiddleware("POST", "/users/{userId}/monitors", "user");
// $router->addAuthMiddleware("POST", "/users/{id}/competitions", "user");
$router->addAuthMiddleware("PATCH", "/users/{id}/competitions/{id}", ["user"]);

