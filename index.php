<?
error_reporting(E_ALL ^ E_DEPRECATED ^ E_USER_DEPRECATED);

require_once (__DIR__ . '/protected/engine/App.php');
$configFilename = __DIR__ . '/protected/config/config_front.php';
App::createWebApplication($configFilename)->run();