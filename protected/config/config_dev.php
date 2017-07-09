<?
if ($_SERVER['HTTP_HOST'] != 'y.retroscene.org') {
    return array(
        'app' => array(
            'appHost' => '195.161.62.176',
        ),
        'components' => array(
            'db' => array(
                'dbHost' => 'localhost',
                'dbName' => 'infraweb_ay',
                'dbUsername' => '046011606_ay',
                'dbPassword' => 'solo123',
                'dbCharset' => 'UTF-8',
            ),
        ),
    );
} else {
    return array();
}
