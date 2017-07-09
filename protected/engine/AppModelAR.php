<?
class AppModelAR extends AppClass {
    
    const AS_ROWS = 1;
    const AS_KEY_ROWS = 2;
    const AS_TREE_ROWS = 3;
    
    private $_modelInitAttributes = null;
    public static $modelFieldsFromDBCache = array();

    public function __construct($modelAttributes = array(), $modelInitParams = array()) {
        $className = get_called_class();
        $modelFields = $className::modelFields();
        //--- set model attributes
        if ((is_array($modelAttributes) || is_object($modelAttributes)) && !empty($modelAttributes)) {
            foreach ($modelAttributes as $k=>$v) {
                $this->$k = $v;
            }
        }
        //--- new model or complete with default params
        if ($modelFields) {
            foreach ($modelFields as $k=>$v) {
                if (!property_exists($this, $k)) {
                    $this->$k = $v;
                }
            }
        }
        $modelInitParams = array_merge(
            array(
                'saveInitAttributes' => false,
            ),
            $modelInitParams
        );
        //--- after model init
        if ($modelInitParams['saveInitAttributes']) {
            $this->_modelInitAttributes = array();
            foreach ($modelAttributes as $k=>$v) {
                $this->_modelInitAttributes[$k] = $v;
            }
        }
        //--- model-based after model init 
        if (method_exists($className, 'modelAfterInit')) {
            $this->modelAfterInit($modelInitParams);
        }
    }

    //TODO WARNING !!! TEST "&__get" - FIX "Indirect modification of overloaded property" (set value of not-preinitialized array property $class->arr[1]=... $class->getArr())
    public function __get($key) {
        $className = get_called_class();
        if ($key[0] != strtolower($key[0])) {
            trigger_error('First letter of propery must be in lower case ' . get_called_class() . '::' . print_r($key, true), E_USER_ERROR);
        }
        $getterMethodName = 'get' . $key;
        if (!empty($key) && method_exists($this, $getterMethodName)) {
            $modelOnlyGetterFields = $className::modelOnlyGetterFields();
            if (!in_array($key, $modelOnlyGetterFields)) {
                $this->$key = $this->$getterMethodName();
                return $this->$key;
            } else {
                return $this->$getterMethodName();
            }
        } else {
           trigger_error('Access to undefined property ' . get_called_class() . '::' . print_r($key, true), E_USER_ERROR);
        }
    }
    
   public static function modelTable() {
        trigger_error('Access to undefined method ' . get_called_class() . '::modelTable', E_USER_ERROR);
    }
    public static function modelTableAlias() {
        $modelClassName = get_called_class();
        return $modelClassName::modelTable();
    }
    public static function modelPrimaryKey() {
        trigger_error('Access to undefined method ' . get_called_class() . '::modelPrimaryKey', E_USER_ERROR);
    }
    public static function modelOnlyGetterFields() {
        return array();
    }
    public static function modelFields() {
        $className = get_called_class();
        trigger_error('Get model fields from db - ' . $className, E_USER_DEPRECATED);
        if (!isset(AppModelAR::$modelFieldsFromDBCache[$className])) {
            AppModelAR::$modelFieldsFromDBCache[$className] = $className::modelFieldsFromDB();
        }
        return AppModelAR::$modelFieldsFromDBCache[$className];
    }
    public static function modelFieldsFromDB() {
        $className = get_called_class();
        $modelTable = $className::modelTable();
        $modelFields = array();
        $fields = App::apl()->db->rows("SHOW COLUMNS FROM `" . $modelTable . "`");
        foreach ($fields as $field) {
            $is_numeric = stristr($field->Type, 'int(') || stristr($field->Type, 'tinyint(') || stristr($field->Type, 'smallint(') || stristr($field->Type, 'decimal') || stristr($field->Type, 'boolean');
            $default = $field->Default;
            if ($is_numeric && $default==(int)$default) {
                $default = (int)$default;
                $default = empty($default) ? 0 : $default;
            } elseif ($default === 'CURRENT_TIMESTAMP') {
                $default = date('Y-m-d H:i:s');
            }
            $modelFields[$field->Field] = $default;
        }
        return $modelFields;
    }

    public function modelUpdate() {
        if ($this->modelIsNew()) {
            trigger_error('Error update ' . $className . ' is new', E_USER_ERROR);
        }
        $className = get_called_class();
        $modelPrimaryKey = $className::modelPrimaryKey();
        $modelFields = $className::modelFields();
        $update = array();
        $where = array();
        foreach ($modelFields as $k=>$v) {
            $checkIsPk = (!is_array($modelPrimaryKey) && $k==$modelPrimaryKey) || (is_array($modelPrimaryKey) && in_array($k, $modelPrimaryKey));
            $value = property_exists($this, $k) ? App::apl()->db->prepareString($this->$k) :  App::apl()->db->prepareString($v);
            if ($checkIsPk) {
                $where[] = "`" . $k . "` = '" . $value . "'";
            } else {
                if (empty($this->_modelInitAttributes) || $this->_modelInitAttributes[$k] != $this->$k) {
                    $update[] = "`" . $k . "` = '" . $value . "'";
                }
            }
        }
        if (!empty($update) && !empty($where)) {
            $queryText = "UPDATE `" . $className::modelTable() . "` SET " . implode(", ", $update) . " WHERE " . implode(" AND ", $where);
            App::apl()->db->query($queryText);
        } elseif (empty($this->_modelInitAttributes)) {
            trigger_error('Error update ' . $className . ' - lost data', E_USER_ERROR);
        }
    }

    public function modelSave($updateIfExists = false) {
        $className = get_called_class();
        if (method_exists($className, 'modelBeforeSave')) {
            $className::modelBeforeSave();
        }
        $modelPrimaryKey = $className::modelPrimaryKey();
        $checkDoUpdate = false;
        if ($updateIfExists) {
            if (!is_array($modelPrimaryKey) && !empty($this->$modelPrimaryKey)) {
                $checkDoUpdate = true;
            } elseif (is_array($modelPrimaryKey)) {
                $checkExists = true;
                foreach ($modelPrimaryKey as $k) {
                    $checkExists = !empty($this->$modelPrimaryKey) ? $checkExists : false;
                }
                if ($checkExists) {
                    $checkDoUpdate = true;
                }
            }
        }
        if ($checkDoUpdate) {
            $this->modelUpdate();
            return;
        }
        $modelFields = $className::modelFields();
        $values = array();
        foreach ($modelFields as $k=>$v) {
            $values[$k] = property_exists($this, $k) ?  App::apl()->db->prepareString($this->$k) :  App::apl()->db->prepareString($v);
        }
        $queryText = "REPLACE INTO `" . $className::modelTable() . "` (`" . implode("`,`", array_keys($values)) . "`) VALUES ('" . implode("','", $values) . "')";
        App::apl()->db->query($queryText);
        if (!is_array($modelPrimaryKey)) {
            $this->$modelPrimaryKey = App::apl()->db->insert_id();
        } else {
            echo 'PK: ' . print_r($modelPrimaryKey);
            print_r(mysql_insert_id());
            die();
        }
        if (method_exists($className, 'modelAfterSave')) {
            $className::modelAfterSave();
        }
    }

   public static function findByPk($id, $modelInitParams = array()) {
        $model = false;
        $modelClassName = get_called_class();
        $modelPK = $modelClassName::modelPrimaryKey();
        $modelTable = $modelClassName::modelTable();
        $modelTableAlias = $modelClassName::modelTableAlias();
        if (!empty($modelPK) && !empty($modelTable)) {
            $where = array();
            if (gettype($modelPK) == 'string' && !is_array($id) && !is_object($id)) {
                $where[] = $modelTableAlias . '.' . $modelPK . " = '" . $id . "'";
            } elseif (gettype($modelPK) == 'array' && is_array($id) && sizeof($id) == sizeof($modelPK)) {
                foreach ($modelPK as $idx=>$fieldName) {
                    $where[] = $modelTableAlias . '.' . $fieldName . " = '" . $id[$idx] . "'";
                }
            }
            if (!empty($where)) {
                if (method_exists($modelClassName, 'modelQuery')) {
                    $modelQuery = $modelClassName::modelQuery();
                    $modelQuery->where = $where;
                    $modelAttributes = App::apl()->db->row($modelQuery->getQueryText());
                } else {
                    $modelAttributes = App::apl()->db->row("SELECT * FROM " . $modelTable . " WHERE " . implode(" AND ", $where) . " LIMIT 1");
                }
                if (!empty($modelAttributes)) {
                    $model = new $modelClassName($modelAttributes, $modelInitParams);
                }
            }
        } else {
            trigger_error('Model ' . $modelClassName . ' don`t have PK or Table definition', E_USER_ERROR);
        }
        return $model;
    }

    public static function findByQuery($queryText, $newIfNotFinded = false) {
        $modelClassName = get_called_class();
        $row = App::apl()->db->row($queryText);
        return $row || $newIfNotFinded ? new $modelClassName($row) : false;
    }

    public static function findModelsByQuery($queryText, $resultType = self::AS_ROWS, $resultKey = null) {
        $results = array();
        $modelClassName = get_called_class();
        $queryResult = App::apl()->db->query($queryText);
        switch ($resultType) {
            case self::AS_ROWS:
                while ($row = App::apl()->db->fetch_row($queryResult)) {
                    $results[] = new $modelClassName($row);
                }
                break;
            case self::AS_KEY_ROWS:
                while ($row = App::apl()->db->fetch_row($queryResult)) {
                    $results[$row->$resultKey] = new $modelClassName($row);
                }
                break;
        }
        return $results;
    }


}