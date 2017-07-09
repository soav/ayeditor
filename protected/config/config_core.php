<?
return array(
    'app' => array(
        'appVersion' => '0.07',
        'appHost' => 'y.retroscene.org',
        'appPath' => '',
        'appWebRoot' => '',
        'appMultiLanguage' => false,
		'includePaths' => array(
            '/protected/engine/',
			'/protected/models/',
        ),
        'controllerPath' => '/protected/controllers/frontend/',
        'appDefaultController' => 'Index',
        'defaultAction' => 'Index',
        'defaultPageJs' => array(
            '/modules/jquery/jquery-3.1.0.min.js',
            '/modules/jquery-ui/jquery-ui.min.js',
            '/modules/player/player.js',
            '/modules/popup/popup.js',
            '/modules/clone-js/clone.js',
            '/modules/deepmerge-js/deepmerge.js',
            'basic-interface.js',
            'script.js.php',
        ),
        'defaultPageCss' => array(
            '/modules/popup/popup.css',
            'style.css.php',
        ),
    ),

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
		'user' => array(
			'autoload' => true,
            'className' => 'AppUser',
		),
        'oauth' => array(
            'autoload' => true,
            'className' => 'AppOauth',
			'redirectUri' => '/oauth/login/',
            'servers' => array (
				'vk' => array (
                    'oauthImage' => 'vk.png',
                    'oauthTitle' => 'vk.com',
					'oauthClientId' => '5628220',
					'oauthClientSecret' => 'Q8bp0tgyNGFTKJxJkd4L',
					'oauthScope' => 'email',
					'oauthVersion' => '2.0',
					'oauthDialogUrl' => 'http://oauth.vk.com/authorize/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&state={STATE}&scope={SCOPE}',
					'oauthTokenUrl' => 'https://oauth.vk.com/access_token',
                    'oauthTokenUrlParams' => '?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&redirect_uri={REDIRECT_URI}&code={CODE}',
					'oauthKeyUserId' => 'user_id',
					'oauthKeyUserEmail' => 'email',
				),
                /*'mailru' => array (
                    'oauthImage' => 'mailru.png',
                    'oauthTitle' => 'mail.ru',
					'oauthClientId' => '747982',
					'oauthClientSecret' => 'da870787fb9566f7f7c48331ccb05e8a',
					'oauthScope' => 'email',
					'oauthVersion' => '2.0',
					'oauthDialogUrl' => 'https://connect.mail.ru/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&state={STATE}&scope={SCOPE}',
					'oauthTokenUrl' => 'https://oauth.vk.com/access_token',
                    'oauthTokenUrlParams' => '?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&redirect_uri={REDIRECT_URI}&code={CODE}',
					'oauthKeyUserId' => 'user_id',
					'oauthKeyUserEmail' => 'email',
                ),*/
            ),
        ),
    ),
    'params' => array(
    ),
);