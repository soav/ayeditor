<?
class AyModuleSample {

    public $name = '';

    public $size = 1;
    public $sizeAttack = 1;
    public $sizeSuspend = 0;
    public $sizeRelease = 0;
    public $sizeLoop2 = 0;
    
    public $positions = array();

    public function __construct() {
        $this->positions[0] = new AyModuleSamplePos();
    }
    
}