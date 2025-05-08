<?php
/**
 * routesに渡すコントローラーとバリデーターの関係
 * controllerAction: コントローラー名@アクション名
 * アクション名がコントローラーとバリデーターのメソッドとなる
 * バリデーターでは、コントローラーのアクション名と同じメソッドでルールを設定する
 * コントローラー名とバリデーター名のprefixは一致させる
 */

//LOGIN
$router->addController("POST", "/login", "AuthController@userLogin");
$router->addController("GET", "/logout/{id}", "AuthController@logout");
$router->addController("POST", "/login/judge", "AuthController@judgeLogin");

//USER
$router->addController("GET", "/users/{id}", "UserController@getUserInfo");
$router->addController("POST", "/users", "UserController@createUser");
$router->addController("PATCH", "/users/{id}", "UserController@updateUser");
$router->addController("DELETE", "/users/{id}", "UserController@deleteUser");

//COMPETITION
$router->addController("GET", "/competitions/{id}", "CompetitionController@getCompetition");
$router->addController("GET", "/users/{id}/competitions", "CompetitionController@getCompetitions");
$router->addController("POST", "/users/{id}/competitions", "CompetitionController@createCompetition");
$router->addController("PATCH", "/users/{id}/competitions/{id}", "CompetitionController@updateCompetition");
$router->addController("DELETE", "/users/{id}/competitions/{id}", "CompetitionController@deleteCompetition");

//CATEGORY
$router->addController("GET", "/users/{id}/competitions/{id}/categories", "CategoryController@getCategoryAll");
$router->addController("GET", "/users/{id}/competitions/{id}/categories/{id}", "CategoryController@getegoryCat");
$router->addController("POST", "/users/{id}/competitions/{id}/categories", "CategoryController@syncCategoryAll");
$router->addController("DELETE", "/users/{id}/competitions/{id}/categories", "CategoryController@deleteCategoryAll");

//RULE ROUTINE
$router->addController("POST", "/users/{id}/competitions/{id}/rules/{round}", "RuleController@syncRuleAll");
$router->addController("POST", "/users/{id}/competitions/{id}/routines/{round}", "RoutineController@syncRoutineAll");

//PLAYER
$router->addController("POST", "/users/{id}/competitions/{id}/players/individual", "PlayerController@syncIndividualPlayerAll");
$router->addController("DELETE", "/users/{id}/competitions/{id}/players/individual", "PlayerController@deleteIndividualPlayerAll");
$router->addController("POST", "/users/{id}/competitions/{id}/players/syncronized", "PlayerController@syncSyncronizedPlayerAll");
$router->addController("DELETE", "/users/{id}/competitions/{id}/players/syncronized", "PlayerController@deleteSyncronizedPlayerAll");

//TEAM
$router->addController("POST", "/users/{id}/competitions/{id}/categories/{id}/teams", "TeamController@syncTeamByCategory");
$router->addController("POST", "/users/{id}/competitions/{id}/teams", "TeamController@syncTeam");
$router->addController("DELETE", "/users/{id}/competitions/{id}/teams", "TeamController@deleteAll");

//ORDER
$router->addController("GET", "/users/{id}/competitions/{id}/orders/{type}/{gender}/{categoryId}/{round}", "OrderController@getOrder");
$router->addController("POST", "/users/{id}/competitions/{id}/orders", "OrderController@syncOrder");

//SCORE
$router->addController("GET", "/competitions/{id}/scores/{gender}/{scoreType}/{rounds}", "ScoreController@getExtractedScore");
$router->addController("POST", "/users/{id}/competitions/{id}/scores", "ScoreController@createScore");
$router->addController("PATCH", "/users/{id}/competitions/{id}/scores/{id}", "ScoreController@updateScore");
$router->addController("DELETE", "/users/{id}/competitions/{id}/scores/{id}", "ScoreController@deleteScore");

//RESULT
$router->addController("GET", "/result/{competitionId}/{type}/{gender}/{categoryId}/{round}/{routine}", "ResultController@getResult");
$router->addController("GET", "/result/{competitionId}/team/{gender}", "ResultController@getTeamResult");
$router->addController("GET", "/result/{competitionId}/team/{gender}/{categoryId}", "ResultController@getTeamResultByCategory");

//PUSHER
$router->addController("POST", "/pusher/{competitionId}/{panel}/judge", "PusherController@sendScoreFromJudge");
$router->addController("POST", "/pusher/{competitionId}/{panel}/system/maxMark", "PusherController@sendMaxMarkFromSystem");
$router->addController("POST", "/pusher/{competitionId}/{panel}/system/isReading", "PusherController@sendIsReadingFromSystem");
$router->addController("POST", "/pusher/{competitionId}/{panel}/monitor", "PusherController@sendMonitorFromSystem");

//MONITOR
$router->addController("POST", "/users/{userId}/monitors", "MonitorController@createMonitor");
$router->addController("PATCH", "/users/{userId}/monitors/{monitorId}", "MonitorController@updateMonitor");

//THREAD & MESSAGE
$router->addController("GET", "/users/{userId}/threads", "ThreadController@getAll");
$router->addController("POST", "/users/{userId}/threads", "ThreadController@createThread");
$router->addController("PATCH", "/users/{userId}/threads/{threadId}", "ThreadController@updateThread");
$router->addController("DELETE", "/users/{userId}/threads/{threadId}", "ThreadController@deleteThread");

$router->addController("POST", "/users/{userId}/threads/{threadId}/messages", "MessageController@createMessage");
$router->addController("PATCH", "/users/{userId}/threads/{threadId}/messages/{messageId}", "MessageController@updateMessage");
$router->addController("DELETE", "/users/{userId}/threads/{threadId}/messages/{messageId}", "MessageController@deleteMessage");

//NOTICE
$router->addController("GET", "/notices", "NoticeController@getAll");
