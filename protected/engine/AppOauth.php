<?
class AppOauth extends AppClass {

    public $servers;
	public $redirectUriAuth;

    public function __construct($conf) {
        $this->servers = $conf['servers'];
		$this->redirectUriAuth = 'http://' . App::apl()->config['app']['appHost'] . App::apl()->config['app']['appWebRoot'] . '/oauth/login/';
		if (!isset($_SESSION['oauth'])) {
			$_SESSION['oauth'] = array();
		}
		foreach ($this->servers as $server_name=>$conf) {
			if (!isset($_SESSION['oauth'][$server_name])) {
				$_SESSION['oauth'][$server_name] = array(
					'code' => false,
					'access_token' => false,
					'expires_in' => false,
					'expires_time' => false,
					'user_id' => false,
					'user_email' => false,
				);
			}
		}
    }

	public function doLogin($server_name, $code) {
		$server = $this->servers[$server_name];
		$oauthTokenUrl = $server['oauthTokenUrl'];
		$post_data = array (
			'client_id' => $server['oauthClientId'],
			'client_secret' => $server['oauthClientSecret'],
			'redirect_uri' => App::apl()->oauth->redirectUriAuth,
			'code' => $code,
		);
		$oauthCurl = new AppCurl($oauthTokenUrl);
		curl_setopt($oauthCurl->curl, CURLOPT_REFERER, App::apl()->oauth->redirectUriAuth);
		$result = $oauthCurl->query($post_data);
		$oauth_result = @json_decode($result['result']);
		if ($result['info']['http_code'] == 200 && is_object($oauth_result) && property_exists($oauth_result, 'access_token')) {
			$_SESSION['oauth'][$server_name]['code'] = $code;
			$_SESSION['oauth'][$server_name]['access_token'] = $oauth_result->access_token;
			$_SESSION['oauth'][$server_name]['expires_in'] = property_exists($oauth_result, 'expires_in') ? (int)$oauth_result->expires_in : 0;
			$_SESSION['oauth'][$server_name]['expires_time'] = $_SESSION['oauth'][$server_name]['expires_in'] ? microtime(true) + $_SESSION['oauth'][$server_name]['expires_in'] : 0;
			$oauthKeyUserId = $server['oauthKeyUserId'];
			$oauthKeyUserEmail = $server['oauthKeyUserEmail'];
			$_SESSION['oauth'][$server_name]['user_id'] = property_exists($oauth_result, $oauthKeyUserId) ? (int)$oauth_result->$oauthKeyUserId : false;
			$_SESSION['oauth'][$server_name]['user_email'] = property_exists($oauth_result, $oauthKeyUserEmail) ? $oauth_result->$oauthKeyUserEmail : false;
			return App::apl()->user->loginByOauth($server_name, $_SESSION['oauth'][$server_name]['user_id'], $_SESSION['oauth'][$server_name]['user_email']);
		} else {
			return false;
		}
	}
	
    public function renderLogin() {
        foreach ($this->servers as $server_name=>$conf) {
			$oauthDialogUrl = $conf['oauthDialogUrl'];
			$oauthDialogUrl = str_replace('{CLIENT_ID}', $conf['oauthClientId'], $oauthDialogUrl);
			$oauthDialogUrl = str_replace('{REDIRECT_URI}', $this->redirectUriAuth, $oauthDialogUrl);
			$oauthDialogUrl = str_replace('{SCOPE}', $conf['oauthScope'], $oauthDialogUrl);
			$oauthDialogUrl = str_replace('{STATE}', $server_name, $oauthDialogUrl);
			?>
            <div class="oauth-server">
                <a class="" href="<?=$oauthDialogUrl?>" title="sign in with <?=$conf['oauthTitle']?>">
                    <img src="<?=App::apl()->config['app']['appWebRoot']?>/media/images/oauth/<?=$conf['oauthImage']?>" />
                </a>
            </div>
        <?}
    }

	public function getUserData($server_name) {
		$result = false;
		switch ($server_name) {
			case 'vk' :
				$result = $this->getUserDataVk();
				break;
		}
		return $result;
	}

}