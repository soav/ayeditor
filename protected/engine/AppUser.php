<?
class AppUser extends AppModelAR {

    public $users_id = 0;

    public static function modelPrimaryKey() {
        return 'users_id';
    }
    public static function modelTable() {
        return 'y_users';
    }

	public function __construct($conf = false) {
		if (!isset($_SESSION['users_id'])) {
			$_SESSION['users_id'] = 0;
		}
		$this->getModelDataByQuery("users_id = '" . (int)$_SESSION['users_id'] . "'");
	}

	private function getModelDataByQuery($query) {
		$row = App::apl()->db->row("SELECT * FROM y_users WHERE " . $query . " LIMIT 1");
		if ($row) {
			foreach($row as $k=>$v) {
				$this->$k = $v;
			}
		}
		return $row;
	}

	public function loginByOauth($server_name, $user_id, $user_email) {
		$user_id_key = 'users_' . $server_name . '_id';
		$user_email_key = 'users_' . $server_name . '_email';
		if (!$this->getModelDataByQuery("`" . $user_id_key . "` = '" . (int)$user_id . "' OR `" . $user_email_key . "` LIKE '" . $user_email . "' OR users_email LIKE '" . $user_email . "'")) {
			$this->$user_id_key = (int)$user_id;
			$this->$user_email_key = $user_email;
			$this->modelSave();
		}
		$_SESSION['users_id'] = $this->users_id;
		return true;
	}

    public function login($login, $pass) {
        $result = $this->getModelDataByQuery("`users_email` = '" . App::apl()->db->prepareString($login) . "' AND users_pass = '" . $this->encryptPassword($pass) . "'");
        $_SESSION['users_id'] = $this->users_id;
        return $result;
    }
    public function logout() {
        $this->users_id = 0;
        $_SESSION['users_id'] = $this->users_id;
    }
    
    public function encryptPassword($pass) {
        return md5(md5($pass));
    }

	public function getUserName() {
		return !empty($this->users_nickname) ? $this->users_nickname : 'NoName#' . $this->users_id;
	}


    //---
    public function getSettings() {
        return App::apl()->db->key_results("settings_key", "settings_val", "SELECT * FROM `y_users_settings` WHERE users_id = '" . $this->users_id . "'");
    }
    public function getDefaultSettings() {
        return App::apl()->db->key_results("settings_key", "settings_val", "SELECT * FROM `y_users_settings` WHERE users_id = 0");
    }

    public function getSettingsValue($settingsKey) {
        return isset($this->settings[$settingsKey]) ? $this->settings[$settingsKey] : $this->defaultSettings[$settingsKey];
    }
    
}