<?php

//USER
$router->addAuthMiddleware("PATCH", "/users/{id}", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}", ["user", "admin"]);

//COMPETITION
$router->addAuthMiddleware("POST", "/users/{id}/competitions", ["user", "admin"]);
$router->addAuthMiddleware("PATCH", "/users/{id}/competitions/{id}", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}", ["user", "admin"]);

//CATEGORY
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/categories", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}/categories", ["user", "admin"]);

//RULE ROUTINE
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/rules/{round}", ["user", "admin"]);
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/routines/{round}", ["user", "admin"]);

//PLAYER
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/players/individual", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}/players/individual", ["user", "admin"]);
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/players/syncronized", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}/players/syncronized", ["user", "admin"]);

//TEAM
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/categories/{id}/teams", ["user", "admin"]);
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/teams", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}/teams", ["user", "admin"]);

//ORDER
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/orders", ["user", "admin"]);

//SCORE
$router->addAuthMiddleware("POST", "/users/{id}/competitions/{id}/scores", ["user", "admin"]);
$router->addAuthMiddleware("PATCH", "/users/{id}/competitions/{id}/scores/{id}", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{id}/competitions/{id}/scores/{id}", ["user", "admin"]);

//PUSHER
$router->addAuthMiddleware("POST", "/pusher/{competitionId}/{panel}/judge", ["judge", "user", "admin"]);
$router->addAuthMiddleware("POST", "/pusher/{competitionId}/{panel}/system/maxMark", ["user", "admin"]);
$router->addAuthMiddleware("POST", "/pusher/{competitionId}/{panel}/system/isReading", ["user", "admin"]);
$router->addAuthMiddleware("POST", "/pusher/{competitionId}/{panel}/monitor", ["user", "admin"]);

//MONITOR
$router->addAuthMiddleware("POST", "/users/{userId}/monitors", ["user", "admin"]);
$router->addAuthMiddleware("PATCH", "/users/{userId}/monitors/{monitorId}", ["user", "admin"]);

//THREAD & MESSAGE
$router->addAuthMiddleware("POST", "/users/{userId}/threads", ["user", "admin"]);
$router->addAuthMiddleware("PATCH", "/users/{userId}/threads/{threadId}", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{userId}/threads/{threadId}", ["user", "admin"]);

$router->addAuthMiddleware("POST", "/users/{userId}/threads/{threadId}/messages", ["user", "admin"]);
$router->addAuthMiddleware("PATCH", "/users/{userId}/threads/{threadId}/messages/{messageId}", ["user", "admin"]);
$router->addAuthMiddleware("DELETE", "/users/{userId}/threads/{threadId}/messages/{messageId}", ["user", "admin"]);

