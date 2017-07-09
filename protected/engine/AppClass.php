<?
class AppClass {

    public function __construct($data = false) {
        if (!empty($data) && (is_array($data) || is_object($data))) {
            foreach ($data as $k=>$v) {
                $this->$k = $v;
            }
        }
    }

    public function __get($key) {
        $fn_name = 'get' . $key;
        if (method_exists($this, $fn_name)) {
            $this->$key = $this->$fn_name();
            return $this->$key;
        } else {
            trigger_error('Access to undefined property ' . get_called_class() . '::' . $key, E_USER_ERROR);
        }
    }

    public function __call($action, $arguments = array()) {
        trigger_error("Access to undefined method " . get_called_class() . '::' . $action, E_USER_ERROR);
    }

}