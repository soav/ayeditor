<?
class AppLanguage extends AppClass {

    public $languages_id;
    public $languages;
    public $languages_codes = array();
    public $text;

    public function __construct($conf) {
        $this->languages_id = 1;
        $this->languages = App::apl()->db->key_rows("languages_id", "SELECT * FROM languages ORDER BY languages_id ASC");
        foreach ($this->languages as $lng) {
            $this->languages_codes[$lng->languages_code] = $lng;
        }
    }

    public function getLngText($lng_text_id) {
        if (!$this->text) {
            $this->text = App::apl()->db->key_results("lng_text_id", "lng_text", "SELECT * FROM languages_text WHERE languages_id = '" . $this->languages_id . "'");
        }
        return $this->text[$lng_text_id];
    }

    public function getLanguages() {
        return $this->languages;
    }

    public function setLngByCode($languages_code) {
        $this->languages_id = $this->languages_codes[$languages_code]->languages_id;
    }
    public function getLngCode() {
        return $this->languages[$this->languages_id]->languages_code;
    }

}