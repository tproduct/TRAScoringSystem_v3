<?php
/**
 * 100~ データベースエラー
 * 200~ バリデーションエラー
 * 300~ コントローラーエラー
 *  */

$errorCodes = [
  "101" => "Model:insert",
  "102" => "Model:insertToOtherTables",
  "103" => "Model:update",
  "104" => "Model:updateAllInSameTable",
  "105" => "Model:updateAllInDifferentTable",
  "106" => "Model:sync",
  "107" => "Model:delete",
  "108" => "Model:deleteByColumn",
  "109" => "Model:deleteAll",
  "201" => "Validator:checkInput/NULLBYTE",
  "202" => "Validator:checkInput/ENCODE",
  "203" => "Validator:checkInput/CONTROLECHAR",
  "204" => "Validator:checkInput/TOOMANYCHARS",
  "205" => "Validator:validateArray/general",
  "301" => "Controller:user not found",
  "302" => "Controller:duplicate E-Mail",
  "303" => "Controller:competition not found",
  "304" => "Controller:POST Failure",
  "305" => "Controller:PATCH Failure",
  "306" => "Controller:SYNC Failure",
  "307" => "Controller:DELETE Failure",
  "308" => "OrderController:SYNC Failure",
  "309" => "Controller:result not found",

];