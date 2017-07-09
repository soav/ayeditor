<?
class controllerOauth extends AppController {

	public function actionLogin() {
		$server_name = isset($_GET['state']) ? $_GET['state'] : false;
		$code = isset($_GET['code']) ? $_GET['code'] : false;
		$error = isset($_GET['error']) ? $_GET['error'] : false;
		if ($error || !$code) {
			$this->renderPage('oauth/error');
		} elseif ($server_name && $code && isset(App::apl()->oauth->servers[$server_name])) {
			$result = App::apl()->oauth->doLogin($server_name, $code);
            header("Location: " . $this->getHref());
			//$this->renderPage('oauth/success');
		} else {
			$this->renderPage('page404');
		}
	}

}