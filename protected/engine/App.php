<?
class App {

    const APPMODE_WEB = 1;
    const APPMODE_CONSOLE = 2;

    private static $_apl;
    
    public $appMode = self::APPMODE_WEB;
    
    public $config = array();

    public static function apl($configFilename = false, $appMode = self::APPMODE_WEB) {
        if (null === self::$_apl) {
            self::$_apl = new self($configFilename);
            self::$_apl->appMode = $appMode;
            if (!empty($configFilename)) {
                self::$_apl->setConfig($configFilename);
            }
        }
        return self::$_apl;
	}

    private function __construct($configFilename = false) {
        spl_autoload_register(array('App', 'autoload'));
    }

    private function __clone() {
    }
    
    public function __get($propName) {
        if (isset($this->config['components'][$propName])) {
            $className = $this->config['components'][$propName]['className'];
            $this->$propName = new $className($this->config['components'][$propName]);
            return $this->$propName;
        }
        $className = class_exists($propName) ? $propName : 'App' . ucwords($propName);
        if (class_exists($className)) {
            $this->$propName = new $className();
            return $this->$propName;
        }
        return false;
    }
    
    public function __destruct() {
        spl_autoload_unregister(array('App', 'autoload'));
    }

    public function autoload($className) {
        $classPath = false;
        $classFileName =  $className . '.php';
		if (!isset($this->config['app'])) {
            $classPath = __DIR__ . '/';
        } else {
            if (!$classPath) {
                $absolutePath = __DIR__ . '/';
                if (file_exists($absolutePath . $classFileName)) {
                    $classPath = $absolutePath;
                };
            }
            if (!$classPath) {
                $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $this->config['app']['appPath'] . $this->config['app']['controllerPath'];
                if (file_exists($absolutePath . $classFileName)) {
                    $classPath = $absolutePath;
                };
            }
            foreach ($this->config['app']['includePaths'] as $path) {
                $absolutePath = $_SERVER['DOCUMENT_ROOT'] . $this->config['app']['appPath'] . $path;
                if (file_exists($absolutePath . $classFileName)) {
                    $classPath = $absolutePath;
                    break;
                }
            }
        }
        if (file_exists($classPath . $classFileName)) {
            require_once $classPath . $classFileName;
        }
    }
    
    public static function createWebApplication($configFilename = false) {
        session_start();
        return self::apl($configFilename, self::APPMODE_WEB);
    }

    public static function createConsoleApplication($configFilename = false) {
        session_start();
        return self::apl($configFilename, self::APPMODE_CONSOLE);
    }
    
    public function setConfig($configFilename) {
        if (file_exists($configFilename)) {
            $this->config = include_once($configFilename);
        }
        //--- init components
        foreach ($this->config['components'] as $cName=>$cParams) {
            $cClassName = $cParams['className'];
            $this->$cName = new $cClassName($cParams);
        }
        $tables = $this->db->results("SHOW TABLES");
        if (sizeof($tables)) {
            $configQR = $this->db->query("SELECT * FROM y_config");
            while ($row = $this->db->fetch_row($configQR)) {
                $this->config['params'][$row->config_key] = $row->config_val;
            }
        }
    }

    public function parseRoute() {
        $route = new stdClass();
        $route->page404 = true;
        $route->controllerName = 'Index';
        $route->actionName = 'Page404';
        $rq_uri = str_replace($this->config['app']['appWebRoot'], '', $_SERVER['REQUEST_URI']);
        $rq_uri = str_replace('index.php', '', $rq_uri);
        $rq_uri = str_replace('?' . $_SERVER['QUERY_STRING'], '', $rq_uri);

        $route->query_path = explode('/', $rq_uri);
        $route->real_query_path = array('');
        $i = 1;
		// parse app path
		if (App::apl()->config['app']['appPath'] && $route->query_path[$i] == App::apl()->config['app']['appPath']) {
			$route->real_query_path[] = App::apl()->config['app']['appPath'];
			$i++;
		}
        // parse lng
        if (App::apl()->config['app']['appMultiLanguage']) {
            if (isset($route->query_path[$i]) && !empty($route->query_path[$i]) && isset(App::apl()->lng->languages_codes[$route->query_path[$i]])) {
                App::apl()->lng->setLngByCode($route->query_path[$i]);
                $i++;
            }
            if (App::apl()->lng->languages_id != DEFAULT_LANGUAGES_ID) {
                $route->real_query_path[] = App::apl()->lng->getLngCode();
            }
        }
        $controllerName = $actionName = false;
        // parse controller
        if (isset($route->query_path[$i]) && !empty($route->query_path[$i])) {
            $controllerName = ucfirst($route->query_path[$i]);
            $controllerClassName = 'controller' . $controllerName;
            $controllerFileName = $this->getControllerFileName($controllerClassName);
            if (file_exists($controllerFileName)) {
                $i++;
                $route->real_query_path[] = strtolower($controllerName);
                $actionName = isset($route->query_path[$i]) && !empty($route->query_path[$i]) ? ucfirst($route->query_path[$i]) : 'Index';
                $actionMethodName = 'action' . $actionName;
                if (method_exists($controllerClassName, $actionMethodName)) {
                    if ($actionName != 'Index') {
                        $route->real_query_path[] = strtolower($actionName);
                    }
                    $i++;
                }
            }
        } else {
            $controllerName = App::apl()->config['app']['appDefaultController'];
            $actionName = 'Index';
        }
        if ($controllerName && $actionName && (!isset($route->query_path[$i]) || empty($route->query_path[$i]) || $route->query_path[$i][0] == '?')) {
            $route->page404 = false;
            $route->actionName = $actionName;
            $route->controllerName = $controllerName;
        }
		if (isset($route->query_path[$i]) && isset($route->query_path[$i][0]) && $route->query_path[$i][0] == '?') {
			$route->real_query_path[] = $route->query_path[$i];
		} else {
			$route->real_query_path[] = '';
		}
        $route->query_string = implode('/', $route->query_path);
        $route->real_query_string = implode('/', $route->real_query_path);
        if (!($route->controllerName == 'Oauth' || ($route->controllerName == 'User' && ($route->actionName == 'Login' || $route->actionName == 'Logout')))) {
            $_SESSION['last_visited_page'] = $route->page404 ? '/' : $route->real_query_string;
        }
        return $route;
    }

    public function getControllerFileName($controllerClassName) {
        return $_SERVER['DOCUMENT_ROOT'] . $this->config['app']['appPath'] . $this->config['app']['controllerPath'] . $controllerClassName . '.php';
    }

    public function getLastVisitedPage() {
        return isset($_SESSION['last_visited_page']) ? $_SESSION['last_visited_page'] : '/';
    }

    /*--- execute application ---*/
    public function run() {
        header('Content-Type: text/html; charset=utf-8');
        $route = $this->parseRoute();
        if (!$route->page404 && strcasecmp($route->query_string, $route->real_query_string) !== 0) {
            header("Location: " . $route->real_query_string);
        }
        $actionMethodName = 'action' . $route->actionName;
        $controllerClassName = 'controller' . $route->controllerName;
        $this->controller = new $controllerClassName();
        $this->controller->$actionMethodName();
    }

}