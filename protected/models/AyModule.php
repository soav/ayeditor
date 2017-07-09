<?
class AyModule {

    const SLIDE_TYPE_ABS = 0;
    const SLIDE_TYPE_REL = 1;

    public $moduleName = '';
    public $moduleAuthor = '';

    public $moduleChipQty = 1;
    public $moduleSpeed = 3;
    public $moduleNoteTableId = 0;
    public $moduleLoop = 0;

    public $samples = array();
    public $ornaments = array();
    public $track = array();
    public $patterns = array();

    public $channelEnv = array();
    public $channelNoise = array();
    public $channelTone = array();

    public function __construct() {
        $this->track[0] = 0;
        $this->patterns[0] = new AyModulePattern();
        for ($i = 1; $i < 36; $i++) {
            $this->samples[$i] = new AyModuleSample();
            $this->samples[$i]->name = 'smpl_' . sprintf('%02d', $i);
            $this->ornaments[$i] = new AyModuleOrnament();
            $this->ornaments[$i]->name = 'orn_' . sprintf('%02d', $i);
        }
    }

}