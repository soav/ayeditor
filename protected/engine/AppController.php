<?
class AppController extends AppClass {

    public $pageTitle;
    public $pageJs;
    public $pageCss;

	public $viewPath;
	
    public $isAjax = false;

    public function __construct() {
        $this->isAjax = isset($_GET['ajax']);
		$this->viewPath = App::apl()->config['app']['appPath'] ? App::apl()->config['app']['appPath'] : '/';
        $this->pageJs = isset(App::apl()->config['app']['defaultPageJs']) ? App::apl()->config['app']['defaultPageJs'] : array();
        $this->pageCss = isset(App::apl()->config['app']['defaultPageCss']) ? App::apl()->config['app']['defaultPageCss'] : array();
    }

    private function renderJsCss($type) {
        $result = false;
        $renderName = 'page' . $type;
        foreach ($this->$renderName as $entry) {
            $file_versioned_name = $entry;
            if ($type == 'Js') {
                $path = strstr($entry, '/') ? $this->viewPath : $this->viewPath . '/view/js/';
                $file_versioned_name .= '?v=' . filemtime(str_replace('.php', '', $_SERVER['DOCUMENT_ROOT'] . $path . $entry));
                $result .= '<script type="text/javascript" language="javascript" src="' . $path . $file_versioned_name . '"></script>';
            } elseif ($type == 'Css') {
                $path = strstr($entry, '/') ? $this->viewPath : $this->viewPath . '/view/css/';
                //$file_versioned_name .= '?v=' . filemtime(str_replace('.php', '', $_SERVER['DOCUMENT_ROOT'] . $path . $entry));
                $result .= '<link rel="stylesheet" type="text/css" href="' . $path . $file_versioned_name . '">';
            }
        }
        return $result;
    }
    public function renderJs() {
        return $this->renderJsCss('Js');
    }
    public function renderCss() {
        return $this->renderJsCss('Css');
    }

    public function getTemplatesPath($tplName) {
        return $_SERVER['DOCUMENT_ROOT'] . $this->viewPath . '/view/template/';
    }

    public function renderPage($tplName = false, $tplVars = array()) {
        $pageLayout = 'index';
        if (strstr($tplName, ':')) {
            list ($pageLayout, $tplName) = explode(':', $tplName);
        }
        extract($tplVars);
        $tplFileName = $this->getTemplatesPath($tplName) . $tplName . '.php';
        if ($this->isAjax) {
            if (file_exists($tplFileName)) {
                include $tplFileName;
            }
        } else {
            $pageLayoutPath = $_SERVER['DOCUMENT_ROOT'] . $this->viewPath . '/view/layout/' . $pageLayout . '.php';
            include $pageLayoutPath;
        }
    }
    public function renderPartial($tplName = false, $tplVars = array()) {
        extract($tplVars);
        $tplFileName = $this->getTemplatesPath($tplName) . $tplName . '.php';
        if (file_exists($tplFileName)) {
            include $tplFileName;
        }
    }

    public function getHref($controllerName = false, $actionName = false, $params = array()) {
        $path = array();
		if (App::apl()->config['app']['appPath']) {
			$path[] = App::apl()->config['app']['appPath'];
		}
        if (App::apl()->config['app']['appMultiLanguage']) {
            if (DEFAULT_LANGUAGES_ID != App::apl()->lng->languages_id) {
                $path[] = App::apl()->lng->getLngCode();
            }
        }
        if ($controllerName) {
            if ($controllerName != App::apl()->config['app']['appDefaultController'] || ($actionName && $actionName != 'Index')) {
                $path[] = strtolower($controllerName);
            }
            if ($actionName) {
                $path[] = strtolower($actionName);
            }
        }
		if (!empty($params)) {
			if (is_array($params)) {
				$params = http_build_query($params);
			}
			$path[] = '?' . $params;
		}
		$path = implode('/', $path) . '/';
        if ($path[0] != '/') {
            $path = '/' . $path;
        }
        return $path;
    }

}