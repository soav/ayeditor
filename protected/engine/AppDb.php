<?
class AppDb extends AppModule {

	public $db_handle;
	public $db_prefix;
	
	public $db_engine = 'mysql';
	public $db_encoding = 'utf-8';
	
	public $mysql_assoc;
	public $mysql_num;
    
    public $stat_query_qty = 0;
    public $stat_query_time = 0;
    public $stat_fetch_qty = 0;
    public $stat_fetch_time = 0;

	//--- construct & destruct class layer
	public function __construct($conf) {
        $this->db_encoding = $conf['dbCharset'];
		$this->db_handle = mysql_connect($conf['dbHost'], $conf['dbUsername'], $conf['dbPassword']);
		mysql_select_db($conf['dbName'], $this->db_handle);
		mysql_set_charset($this->db_encoding, $this->db_handle);
		$this->mysql_assoc = MYSQL_ASSOC;
		$this->mysql_num = MYSQL_NUM;
    }

    public function __destruct() {
        if ($this->db_handle) {
            mysql_close($this->db_handle);
        }
    }

    public function freeResult($queryResult) {
        return mysql_free_result($queryResult);
    }

    public function get_charset() {
        return mysql_client_encoding($this->db_handle);
    }

    public function set_charset($charset) {
        $this->db_encoding = $charset;
        mysql_set_charset($this->db_encoding, $this->db_handle);
    }
    
	//--- table prefixes layer
	public function tbl_prefix($query_text){
        return $query_text;
		//return preg_replace('/`(.*?)`/', $this->db_prefix.'\\1', $query_text);
	}
	//--- mysql layer
	public function check_error($err_query = '') {
		$err_id = mysql_errno($this->db_handle);
		$err_text = mysql_error($this->db_handle);
		if ($err_id != 0 or !empty($err_text)) {
			trigger_error($err_id . ": " . $err_text . " :: \"" . $err_query . "\"", E_USER_ERROR);
		}
	}
	public function insert_id() {
		return mysql_insert_id($this->db_handle);
    }
	public function num_rows($query_result) {
		return mysql_num_rows($query_result);
    }
	public function query($query_text) {
        $this->stat_query_qty++;
        $time = microtime(true);
		$ret = mysql_query($this->tbl_prefix($query_text), $this->db_handle);
		$this->check_error($query_text);
        $this->stat_query_time += microtime(true) - $time;
        return $ret;
    }
	public function fetch_row($query_result) {
        $this->stat_fetch_qty++;
        $time = microtime(true);
        $result = mysql_fetch_object($query_result);
        $this->stat_fetch_time += microtime(true) - $time;
		return $result;
    }
	public function fetch_object($query_result){
		return $this->fetch_row($query_result);
    }
	public function fetch_array($query_result, $fetch_type = false){
		if ($fetch_type === false) {
			$fetch_type = $this->mysql_assoc;
		}
        $this->stat_fetch_qty++;
        $time = microtime(true);
		$result = mysql_fetch_array($query_result, $fetch_type);
        $this->stat_fetch_time += microtime(true) - $time;
		return $result;
    }
	//--- object layer (like mysql)
	public function row($query_text, $arr = false) {
		$query = $this->query($query_text);
		if ($query !== false) {
			return $arr ? $this->fetch_array($query) : $this->fetch_object($query);
		} else {
            return false;
        }
    }
	public function rows($query_text, $arr = false) {
		$query = $this->query($query_text);
		if ($query !== false) {
			$result = array();
			while ($tmp = $arr ? $this->fetch_array($query) : $this->fetch_object($query)) {
				$result[] = $tmp;
			}
			return $result;
        } else {
            return false;
        }
    }
	public function key_rows($key, $query_text, $arr = false) {
		$query = $this->query($query_text);
		if ($query !== false) {
			$result = array();
			while ($tmp = $arr ? $this->fetch_array($query) : $this->fetch_object($query)){
				$result[$arr ? $tmp[$key] : $tmp->$key] = $tmp;
				}
			return $result;
		} else {
            return false;
        }
	}
	public function result($query_text) {
		$query = $this->query($query_text);
		if ($query !== false) {
			$tmp = $this->fetch_array($query, $this->mysql_num);
			return $tmp[0];
		} else {
            return false;
        }
    }
	public function results($query_text) {
		$result = array();
		$query = $this->query($query_text);
		if ($query !== false) {
			while ($tmp = $this->fetch_array($query, $this->mysql_num)) {
				$result[] = $tmp[0];
			}
			return $result;
        } else {
            return false;
        }
    }
	public function key_results($key, $val, $query_text) {
		$result = array();
		$query = $this->query($query_text);
		if ($query !== false) {
			while ($tmp = $this->fetch_object($query)) {
				$result[$tmp->$key]=$tmp->$val;
			}
			return $result;
        } else {
            return false;
        }
    }
	
	private function tree_rows_fetch(&$result, &$keys, &$row, $keys_size, $key_id = 0) {
		$k = $row->$keys[$key_id];
		if ($key_id < $keys_size - 1) {
			if (!isset($result[$k])) {
				$result[$k] = array();
			}
			$this->tree_rows_fetch($result[$k], $keys, $row, $keys_size, $key_id+1);
		} else {
			$result[$k] = clone $row;
		}
		
	}
	public function tree_rows($keys, $query_text) {
		$result = array();
		$query_result = $this->query($query_text);
		while ($row = $this->fetch_object($query_result)) {
			foreach ($keys as $key) {
				$this->tree_rows_fetch($result, $keys, $row, sizeof($keys));
			}
		}
		return $result;
	}
	
	
	public function save_object($table, $row) {
		$data = (array)$row;
		$query = "REPLACE INTO `" . $table . "` (`" . implode("`,`", array_keys($data))  . "`) VALUES ('" . implode("','", $data) . "')";
		$this->query($query);
		return $this->insert_id();
	}
    public function getStat() {
        return array(
            'db_total_time' => number_format($this->stat_query_time + $this->stat_fetch_time, 2, ".", ""),
            'db_query_time' => number_format($this->stat_query_time, 2, ".", ""),
            'db_fetch_time' => number_format($this->stat_fetch_time, 2, ".", ""),
            'db_query_qty' => number_format($this->stat_query_qty, 0, ".", "'"),
            'db_fetch_qty' => number_format($this->stat_fetch_qty, 0, ".", "'"),
        );
    }

    public function prepareString ($string) {
        return mysql_real_escape_string($string, $this->db_handle);
    }
}