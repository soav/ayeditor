<?
class controllerIndex extends AppController {

    public function actionIndex() {
        if (isset($_SESSION['currentModuleId']) && $_SESSION['currentModuleId'] != 0) {
            header('Location: ' . $this->getHref('studio', 'index'));
            return;
        }
        $this->RenderPage('studio/logo');
    }

    public function actionPage404() {
    }
}