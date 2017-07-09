<?
class AyModulePatternPos {

    public $envPer = 0;
    public $envForm = 0;

    public $noisePer = 0;

    public $channels = array();

    public function __construct() {
        for ($ch = 0; $ch < 3; $ch++) {
            $this->channels[$ch] = new StdClass();
            $this->channels[$ch]->note = 0;
            $this->channels[$ch]->noteOctave = 0;
            $this->channels[$ch]->instrument = 0;
            $this->channels[$ch]->sample = 0;
            $this->channels[$ch]->ornament = 0;
            $this->channels[$ch]->volume = 0;
        }
    }

}