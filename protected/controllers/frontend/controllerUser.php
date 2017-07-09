<?
class controllerUser extends AppController {

    public function actionLogin() {
        if (App::apl()->user->users_id != 0) {
            header('Location: ' . $this->getHref());
            return;
        }
        if (isset($_POST['auth']) && is_array($_POST['auth'])) {
            $login = isset($_POST['auth']['users_email']) ? $_POST['auth']['users_email'] : false;
            $pass = isset($_POST['auth']['users_pass']) ? $_POST['auth']['users_pass'] : false;
            if (App::apl()->user->login($login, $pass)) {
                header('Location: ' . $this->getHref());
                return;                
            }
        }
        $this->renderPage('user/login');
    }

    public function actionLogout() {
        App::apl()->user->logout();
        header('Location: ' . $this->getHref());
    }

    public function actionRegister() {
        $this->renderPage('user/register');
    }

    public function actionSettingsGetColors() {
        $color_shemes_id = isset($_GET['color_shemes_id']) ? (int)$_GET['color_shemes_id'] : 0;
        $colorSheme = AppColorSheme::findByPk($color_shemes_id);
        if (!$colorSheme) {
            $colorSheme = AppColorSheme::findByPk(1);
        }
        $colors = App::apl()->db->key_results("color_key", "color_val", "SELECT * FROM y_color_shemes_colors WHERE color_shemes_id = '" . $colorSheme->color_shemes_id . "'");
        echo json_encode($colors);
    }

    public function actionSettings() {
        $colorsKeys = App::apl()->db->key_rows("color_shemes_keys_id", "SELECT * FROM y_color_shemes_keys ORDER BY pos");
        //--- save
        if (App::apl()->user->users_id != 0) {
            if (isset($_POST['settings']) && is_array($_POST['settings'])) {
                //--- user settings
                $userSettingsUpdate = array();
                foreach (App::apl()->user->defaultSettings as $k=>$default) {
                    $newVal = isset($_POST['settings']['user_settings'][$k]) ? (int)$_POST['settings']['user_settings'][$k] :
                        (isset(App::apl()->user->settings[$k]) ? App::apl()->user->settings[$k] : $default);
                    if (!isset(App::apl()->user->settings[$k]) || App::apl()->user->settings[$k] != $newVal) {
                        App::apl()->user->settings[$k] = $newVal;
                        $userSettingsUpdate[$k] = "'" . $k . "', '" . App::apl()->user->users_id . "', '" . $newVal . "'";
                    }
                }
                if (!empty($userSettingsUpdate)) {
                    $queryText = "REPLACE INTO y_users_settings (settings_key, users_id, settings_val) VALUES (" . implode("),(", $userSettingsUpdate) . ")";
                    App::apl()->db->query($queryText);
                }
                //--- color scheme
                $colorShemeId = App::apl()->user->getSettingsValue('colorShemeId');
                $colorSheme = AppColorSheme::findByPk($colorShemeId);
                if (!$colorSheme) {
                    $colorSheme = new AppColorSheme();
                    $colorSheme->users_id = App::apl()->user->users_id;
                }
                if ($colorSheme->users_id == App::apl()->user->users_id || ($colorSheme->users_id == 0 && App::apl()->user->users_id == 1)) {
                    $colorSheme->color_shemes_name = isset($_POST['settings']['color_shemes']['color_shemes_name']) ? $_POST['settings']['color_shemes']['color_shemes_name'] : $colorSheme->color_shemes_name;
                    $colorSheme->modelSave();
                    $updateColors = array();
                    foreach ($colorsKeys as $k=>$default) {
                        $newVal = isset($_POST['settings']['colors'][$k]) ? $_POST['settings']['colors'][$k] : $default->color_shemes_default_value;
                        $updateColors[$k] = "'" . $colorSheme->color_shemes_id . "', '" . $k . "', '" . $newVal . "'";    
                    }
                    $queryText = "REPLACE INTO y_color_shemes_colors (color_shemes_id, color_key, color_val) VALUES ("
                        . implode("),(", $updateColors) . ")";
                    App::apl()->db->query($queryText);
                    if ($colorShemeId == 0) {
                        App::apl()->user->settings['colorShemeId'] = $colorSheme->color_shemes_id;
                        $queryText = "REPLACE INTO y_users_settings (settings_key, users_id, settings_val) VALUES ('colorShemeId', '" . App::apl()->user->users_id . "', '" . $colorSheme->color_shemes_id . "')";
                        App::apl()->db->query($queryText);
                    }
                }
            }
        }

        $color_shemes_colors = App::apl()->db->key_results("color_key", "color_val", "SELECT * FROM y_color_shemes_colors
            WHERE color_shemes_id = '" . App::apl()->user->getSettingsValue('colorShemeId') . "'"
        );
        
        $users = App::apl()->db->key_rows("users_id", "SELECT * FROM y_users");
        $color_shemes = App::apl()->db->key_rows("color_shemes_id", "SELECT * FROM y_color_shemes ORDER BY IF(users_id=0,0,1) ASC, color_shemes_name ASC");
        $color_shemes_groups = App::apl()->db->rows("SELECT * FROM y_color_shemes_groups ORDER BY pos");
        $color_shemes_keys = App::apl()->db->tree_rows(
            array("color_shemes_groups_id", "color_shemes_keys_id"),
            "SELECT * FROM y_color_shemes_keys ORDER BY pos"
        );
        $this->pageCss[] = '/modules/colorpicker/css/colorpicker.css';
        $this->pageJs[] = '/modules/colorpicker/js/colorpicker.js';
        $this->pageJs[] = 'settings.js';
        $this->renderPage('user/settings', array(
            'users' => $users,
            'color_shemes' => $color_shemes,
            'color_shemes_groups' => $color_shemes_groups,
            'color_shemes_keys' => $color_shemes_keys,
            'color_shemes_colors' => $color_shemes_colors,
        ));
    }
}