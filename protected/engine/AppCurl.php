<?
class AppCurl extends AppClass {

	public $url;
	public $curl;

	public function __construct($url = false) {
		$this->url = $url;
		$this->curl = curl_init($url);
	}

	public function __destruct() {
		curl_close($this->curl);
	}

	public function query($post_data = false, $timeouts = array(3,15)) {
		curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->curl, CURLOPT_CONNECTTIMEOUT, $timeouts[0]);
		curl_setopt($this->curl, CURLOPT_TIMEOUT, $timeouts[1]);
		curl_setopt($this->curl, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, false);
		if ($post_data) {
			curl_setopt($this->curl, CURLOPT_POST, TRUE);
			curl_setopt($this->curl, CURLOPT_POSTFIELDS, $post_data);
		}
		$result = curl_exec($this->curl);
		$info = curl_getinfo($this->curl);
		return array (
			'info' => $info,
			'result' => $result,
		);
	}
	
}