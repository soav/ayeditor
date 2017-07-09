<?
header("Content-type: text/js");
require_once ('../../protected/engine/App.php');
$configFilename = '../../protected/config/config_front.php';
App::createWebApplication($configFilename);
$module = new AyModule();
$moduleJson = json_encode($module);
$scriptFile = file_get_contents(__DIR__ . '/script.js');
$aymTestModule = file_get_contents('../../files/modules/y-studio-test-module.aym');


$scriptFile = str_replace("'<Y_TEST_MODULE>'", ($aymTestModule), $scriptFile);
$scriptFile = str_replace("'<Y_MODULE>'", $moduleJson, $scriptFile);
$scriptFile = str_replace("'<Y_MODULE_SAMPLE_POS>'", json_encode(new AyModuleSamplePos), $scriptFile);
$scriptFile = str_replace("'<Y_MODULE_ORNAMENT_POS>'", json_encode(new AyModuleOrnamentPos), $scriptFile);
$scriptFile = str_replace("'<Y_MODULE_PATTERN>'", json_encode(new AyModulePattern), $scriptFile);
$scriptFile = str_replace("'<Y_MODULE_PATTERN_POS>'", json_encode(new AyModulePatternPos), $scriptFile);

echo $scriptFile;