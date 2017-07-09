<?
class AyModulePattern {

    public $name = 'NEW';
    public $size = 64;
    public $positions = array();

    public function __construct() {
        for ($pos = 0; $pos < $this->size; $pos++) {
            $this->positions[$pos] = new AyModulePatternPos();
        }
    }

}