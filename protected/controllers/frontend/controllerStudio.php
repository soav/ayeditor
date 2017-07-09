<?
class controllerStudio extends AppController {

    public function __construct() {
        parent::__construct();
        if (App::apl()->user->users_id == 0) {
            header('Location: ' . $this->getHref());
        }
        if (!isset($_SESSION['currentModuleId']) || $_SESSION['currentModuleId'] == 0) {
            //header('Location: ' . $this->getHref());
        }
    }

    public function actionIndex() {
        $module = new AyModule();
        $this->RenderPage('studio/index', array(
            'module' => $module
        ));
    }
    
    public function actionShowModule() {
        $module = new AyModule();
        echo '<pre>'; print_r($module); echo '</pre>';
    }

}