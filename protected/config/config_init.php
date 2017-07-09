<?
$configCore = include(__DIR__ . '/config_core.php');
$configCore['components'] = array();
return AppMap::mergeArray(
    $configCore,
    array(
        'components' => array(
            'db' => array(
                'autoload' => true,
                'className' => 'AppDb',
                'dbHost' => 'localhost',
                'dbName' => 'ayeditor',
                'dbUsername' => 'root',
                'dbPassword' => '',
                'dbCharset' => 'UTF-8',
            ),
        ),
    ),
    (file_exists(__DIR__ . '/config_dev.php') ? include_once(__DIR__ . '/config_dev.php') : array())
);