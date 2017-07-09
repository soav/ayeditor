<?
return AppMap::mergeArray(
	include (__DIR__ . '/config_core.php'),
    array(
        'app' => array(
            'appPath' => '/tracker',
            'appWebRoot' => '/tracker',
			'appDefaultController' => 'Index',
			'controllerPath' => '/protected/controllers/frontend/',
        ),
    ),
    (file_exists(__DIR__ . '/config_dev.php') ? include_once(__DIR__ . '/config_dev.php') : array())
);