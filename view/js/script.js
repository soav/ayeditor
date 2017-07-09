const SLIDE_TYPE_ABS = 0;
const SLIDE_TYPE_REL = 1;

const PLAY_TYPE_TRACK = 0;
const PLAY_TYPE_PATT = 1;
const PLAY_TYPE_PATT_POS = 2;
const PLAY_TYPE_SAMPLE = 3;

/*--- dictionaries ---*/
var dictNote = ['C-','C#','D-','D#','E-','F-','F#','G-','G#','A-','A#','B-'];
var dictEnvOctave = [['0', '1', '2', '3', '4', '5', '6', '7', '8'],['U', 'C', 'L', 'S', '1', '2', '3', '4', '5']];
var dictOctave = [['0', '1', '2', '3', '4', '5', '6', '7', '8'],['U', 'C', 'L', 'S', '1', '2', '3', '4', '5']];
var dictISOValues = ['.', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var dictVolume = ['.', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
var dictEnvForm = ['.', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
var dictHex = ['0', '1', '2', '3', '4', '5', '6', '7' ,'8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

var dictAutoEnv = [[1, 1], [3, 4], [1, 2], [1, 4], [3, 1], [5, 2], [2, 1], [3, 2]];

var dictNoteTable = [
    [
        0,0,0,0,0,0,0,0,2*0x083B,2*0x07C5,2*0x0755,2*0x06EC,
        0x0D10,0x0C55,0x0BA4,0x0AFC,0x0A5F,0x09CA,0x093D,0x08B8,0x083B,0x07C5,0x0755,0x06EC,
        0x0688,0x062A,0x05D2,0x057E,0x052F,0x04E5,0x049E,0x045C,0x041D,0x03E2,0x03AB,0x0376,
        0x0344,0x0315,0x02E9,0x02BF,0x0298,0x0272,0x024F,0x022E,0x020F,0x01F1,0x01D5,0x01BB,
        0x01A2,0x018B,0x0174,0x0160,0x014C,0x0139,0x0128,0x0117,0x0107,0x00F9,0x00EB,0x00DD,
        0x00D1,0x00C5,0x00BA,0x00B0,0x00A6,0x009D,0x0094,0x008C,0x0084,0x007C,0x0075,0x006F,
        0x0069,0x0063,0x005D,0x0058,0x0053,0x004E,0x004A,0x0046,0x0042,0x003E,0x003B,0x0037,
        0x0034,0x0031,0x002F,0x002C,0x0029,0x0027,0x0025,0x0023,0x0021,0x001F,0x001D,0x001C,
        0x001A,0x0019,0x0017,0x0016,0x0015,0x0014,0x0012,0x0011,0x0010,0x000F,0x000E,0x000D,
    ],
];
/*--- settings ---*/
settings = {
    chipType: 0,
    chipFrqType: 0,

    dictOctaveId: 0,
    dictNoteTableId: 0,

    posHexDec: 1,
    noisePerHexDec: 0,

    ornSlideHexDec: 1,
    toneSlideHexDec: 0,
    noiseSlideHexDec: 0,
    envSlideHexDec: 0,
};

//pentagon 49fps
//1000/49 = 20.40816326530612/1

//original 50fps
//1000/50 = 20/1

var constPlayInterval = 20;
var constPlayIntervalDelay = 1;

var playIntervalDelay;
var playIntervalSpeed;

var prePlayCurrIdx = false;

var currTrackPos = 0;
var currPattern = 0;
var currPattPos = 0;

var currOctave = 4;
var currInstrument = 0;
var currSample = 1;
var currOrnament = 1;
var currVolume = 15;

var divTrack;
var divPattern;

var playChipReg = [
    {
        tonePer:  [0,0,0],
        vol: [0,0,0],
        mixTone: [0, 0, 0],
        mixNoise: [0, 0, 0],
        mixEnv: [0, 0, 0],
        envPer: 0,
        envForm: 0,
        noisePer: 0,
    },
    {
        tonePer:  [0,0,0],
        vol: [0,0,0],
        mixTone: [0, 0, 0],
        mixNoise: [0, 0, 0],
        mixEnv: [0, 0, 0],
        envPer: 0,
        envForm: 0,
        noisePer: 0,
    }
];

var module = false;
var yLocalStorage = window.localStorage;

function moduleSaveToLocalStorage() {
	if (module != false) {
		var jsonModule = JSON.stringify(module);
		yLocalStorage.setItem('yStudio_LastModule', jsonModule);
	}
}
function moduleOpenFromLocalStorage() {
	var tmpModule = false;
	var jsonModule = yLocalStorage.getItem('yStudio_LastModule');
	if (jsonModule != undefined) {
		try {
			tmpModule = JSON.parse(jsonModule);
		} catch(e) {
			tmpModule = false;
		}
	}
	return tmpModule;
}


window.onclose = function() {
	alert('123');
	moduleSaveToLocalStorage();
}

function fnGetLastModule() {
	var tmpModule = moduleOpenFromLocalStorage();
	if (tmpModule == false) {
	}
	return tmpModule;
}
function fnGetTestModule() {
    return '<Y_TEST_MODULE>';
}
function fnNewModule() {
    return '<Y_MODULE>';
}
function fnNewSamplePos() {
    return '<Y_MODULE_SAMPLE_POS>';
}
function fnNewOrnamentPos() {
    return '<Y_MODULE_ORNAMENT_POS>';
}
function fnNewPattern() {
    return '<Y_MODULE_PATTERN>';
}
function fnNewPatternPos() {
    return '<Y_MODULE_PATTERN_POS>';
}


function resetPlayChipReg() {
    for (var chip = 0; chip < 2; chip++) {
        playChipReg[chip].envPer = 0;
        playChipReg[chip].envForm = 0;
        playChipReg[chip].noisePer = 0;
        for (ch = 0; ch < 3; ch++) {
            playChipReg[chip].mixTone[ch] = 0;
            playChipReg[chip].mixNoise[ch] = 0;
            playChipReg[chip].mixEnv[ch] = 0;
            playChipReg[chip].vol[ch] = 0;
            playChipReg[chip].tonePer[ch] = 0;
        }
    }
}

function fnRepaint() {
    aymPlayer.drawAnalyser();
    requestAnimationFrame(fnRepaint);
}

function fnCtrlVolume(value) {
    aymPlayer.gainNode.gain.value = value;
}

$(document).on('click', '.layout-change', function(){
    $('.layout-container').css('display', 'none');
    $('.layout-' + $(this).attr('data-layout-id')).css('display', 'block');
});

cloneObj = function (obj) {
    if (typeof obj != "object") {
        return obj;
    }
    var copy = obj.constructor();
    for (var key in obj) {
        if (typeof obj[key] == "object") {
            copy[key] = cloneObj(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
};

function fnParseInt(val) {
    result = undefined;
    if (val === false) {
        result = 0;
    } else if (val === true) {
        result = 1;
    } else {
        result = parseInt(val);
    }
    return result;
}
function fnHtmlNote(noteId, octaveId) {
    return (noteId == 0 && octaveId == 0) ? '---' : dictNote[noteId] + dictOctave[settings.dictOctaveId][octaveId];
}
function fnHtmlHex(num, strLen, allowZero, onZeroStr) {
    num = num==undefined ? 0 : num;
    onZeroStr = onZeroStr==undefined ? '.' : onZeroStr;
    allowZero = allowZero==undefined ? false : allowZero;
    strLen = strLen==undefined ? 2 : strLen;
    var str = '';
    if (num == 0 && !allowZero) {
        while (str.length < strLen) {
            str = onZeroStr + str;
        }
    } else {
        while (num > 0) {
            str = (num & 15).toString(16).toUpperCase() + str;
            num = parseInt(num >>> 4);
        }
        while (str.length < strLen) {
            str = '0' + str;
        }
    }
    while (str.length < strLen) {
        str = (allowZero ? '0' : onZeroStr) + str;
    }
    return str;
}
function fnHtmlDec(num, strLen, allowZero, onZeroStr) {
    num = num==undefined ? 0 : num;
    var str = (num==0 && !allowZero) ? '' : num.toString();
    onZeroStr = onZeroStr==undefined ? '.' : onZeroStr;
    allowZero = allowZero==undefined ? false : allowZero;
    strLen = strLen==undefined ? (num.length & 1 == 0 ? num.length : num.length+1) : strLen;
    while (str.length < strLen) {
        str = (allowZero ? '0' : onZeroStr) + str;
    }
    return str;
}
function fnHtmlDecChar(num, charIdx, allowZero, onZeroStr) {
    num = num==undefined ? 0 : num;
    charIdx = charIdx==undefined ? 0 : charIdx;
    onZeroStr = onZeroStr==undefined ? '.' : onZeroStr;
    allowZero = allowZero==undefined ? false : allowZero;
    var str = num.toString();
    str = str[str.length - 1 - charIdx];
    if (num == 0 && !allowZero) {
        str = onZeroStr;
    }
    if (str == undefined) {
        str = 0;
    }
    return str;
}

function fnHtmlSlide(slide, slideType, strLen) {
    strLen = strLen==undefined ? 2 : strLen;
    slide = parseInt(slide);
    str = slide.toString();
    while (str.length < strLen) {
        str = '0' + str;
    }
    str = (slide >= 0 ? '+' : '-') + str;
    str += slideType == SLIDE_TYPE_ABS ? '_' : '^';
    return str;
}

var editPlayEnvOctave = 1;
var editPlayEnvPer = 0x0034;
var editPlayEnvForm = 0x0E;
var editPlayNoisePer = 0x00;
var editPlayNote = 0;
var editPlayOctave = 4;
var editPlayVolume = 0x0F;

function setCurrSample(sampleId) {
    currSample = sampleId == 'DEL' ? 0 : sampleId;
    var selSample = $('div.selector.samples');
    selSample.find('div.selector-item').removeClass('selected');
    selSample.find('div.selector-item[data-selector-id=' + currSample + ']').addClass('selected');
    fnRenderEditSample();
}
function setCurrOrn(ornId) {
    currOrnament = ornId;
    var selOrn = $('div.selector.ornaments');
    selOrn.find('div.selector-item').removeClass('selected');
    selOrn.find('div.selector-item[data-selector-id=' + currOrnament + ']').addClass('selected');
    fnRenderEditOrn();
}


function fnRenderEditPlay() {
    var hexEnvPer = fnHtmlHex(editPlayEnvPer, 4, true);
    var html = '<div class="sampler-section sampler-section-100"><div><span>&nbsp;</span>&nbsp;</div></div>';
    html += '<div class="sampler-play-pos pos">';
    html +=     '<span class="f env-per env-per-0">' + hexEnvPer[0] + '</span>';
    html +=     '<span class="env-per env-per-1">' + hexEnvPer[1] + '</span>';
    html +=     '<span class="env-per env-per-2">' + hexEnvPer[2] + '</span>';
    html +=     '<span class="env-per env-per-3">' + hexEnvPer[3] + '</span>';
    html +=     '<span class="m f env-note">---</span>';
    html +=     '<span class="m f env-form">' + fnHtmlHex(editPlayEnvForm, 1, true) + '</span>';
    html +=     '<div class="sep"><b>&nbsp;</b></div>';
    html +=     '<span class="f noise noise-0">' + fnHtmlDecChar(editPlayNoisePer, 1, true) + '</span>';
    html +=     '<span class="noise noise-1">' + fnHtmlDecChar(editPlayNoisePer, 0, true) + '</span>';
    html +=     '<div class="sep"><b>&nbsp;</b></div>';
    html +=     '<span class="f note">' + fnHtmlNote(editPlayNote, editPlayOctave) + '</span>';
    html +=     '<div class="sep"><b>&nbsp;</b></div>';
    html +=     '<span class="f vol">' + fnHtmlHex(editPlayVolume, 1, true) + '</span>';
    html += '</div>';
    $('.sampler-play').html(html);
}
function fnRenderEditOrn() {
    var ornamentId = currOrnament;
    var html = '<div class="sampler-section sampler-section-attack"><div class="name"><span>&nbsp;</span>beg</div></div>';
    for (var pos = 0; pos < module.ornaments[ornamentId].size + 1; pos++) {
        if (pos == module.ornaments[ornamentId].sizeAttack) {
            html += '<div class="sampler-section sampler-section-suspend drag"><div class="name"><span>&nbsp;</span>lp1b</div></div>';
        }
        if (pos == module.ornaments[ornamentId].sizeAttack + module.ornaments[ornamentId].sizeSuspend) {
            html += '<div class="sampler-section sampler-section-release drag"><div class="name"><span>&nbsp;</span>lp1e</div></div>';
        }
        if (pos == module.ornaments[ornamentId].sizeAttack + module.ornaments[ornamentId].sizeSuspend + module.ornaments[ornamentId].sizeRelease) {
            html += '<div class="sampler-section sampler-section-release drag"><div class="name"><span>&nbsp;</span>lp2b</div></div>';
        }
        if (pos < module.ornaments[ornamentId].size) {
            var posLnk = module.ornaments[ornamentId].positions[pos];
            var htmlNoteSlide = settings.ornSlideHexDec == 0 ? fnHtmlHex(Math.abs(posLnk.noteSlide), 2, true) : fnHtmlDec(Math.abs(posLnk.noteSlide), 2, true);
            html += '<div class="pos sampler-orn-pos" data-pos="' + pos + '">';
            html +=     '<div class="pos-id">' + (settings.posHexDec==0 ? fnHtmlHex(pos, 2, true) : fnHtmlDec(pos, 2, true)) + '</div>';
            html +=     '<div class="sep"><b>&nbsp;</b></div>';
            html +=      '<div class="m orn-slide orn-slide-sign">' + (posLnk.noteSlide >=0 ? '+' : '-') + '</div>';
            html +=      '<span class="f orn-slide orn-slide-0" data-slide-pos="0">' + htmlNoteSlide[0] + '</span>';
            html +=      '<span class="orn-slide orn-slide-1" data-slide-pos="1">' + htmlNoteSlide[1] + '</span>';
            html +=      '<div class="orn-slide orn-slide-type slide-type">' + (posLnk.noteSlideType==SLIDE_TYPE_ABS ? '_' : '^') + '</div>';
            html +=     '<div class="sep"><b>&nbsp;</b></div>';
            html += '</div>';
        }
    }
    html += '<div class="sampler-section sampler-section-end"><div class="name"><span>&nbsp;</span>lp2e</div></div>';
    $('.sampler-orn').html(html);
    $('#sampler-orn-size-atk').val(module.ornaments[ornamentId].sizeAttack);
    $('#sampler-orn-size-sus').val(module.ornaments[ornamentId].sizeSuspend);
    $('#sampler-orn-size-rel').val(module.ornaments[ornamentId].sizeRelease);
    $('#sampler-orn-size-lp2').val(module.ornaments[ornamentId].sizeLoop2);
}

function fnRenderEditSample() {
    var sampleId = currSample;
    var html = '<div class="sampler-section sampler-section-attack"><div class="name"><span>&nbsp;</span>beg</div></div>';
    for (var pos = 0; pos < module.samples[sampleId].size + 1; pos++) {
        if (pos == module.samples[sampleId].sizeAttack) {
            html += '<div class="sampler-section sampler-section-suspend drag"><div class="name"><span>&nbsp;</span>lp1b</div></div>';
        }
        if (pos == module.samples[sampleId].sizeAttack + module.samples[sampleId].sizeSuspend) {
            html += '<div class="sampler-section sampler-section-release drag"><div class="name"><span>&nbsp;</span>lp1e</div></div>';
        }
        if (pos == module.samples[sampleId].sizeAttack + module.samples[sampleId].sizeSuspend + module.samples[sampleId].sizeRelease) {
            html += '<div class="sampler-section sampler-section-release drag"><div class="name"><span>&nbsp;</span>lp2b</div></div>';
        }
        if (pos < module.samples[sampleId].size) {
            posLnk = module.samples[sampleId].positions[pos];
            var hexEnvPer = fnHtmlHex(posLnk.envPer, 4, false);
            var htmlNoisePer = settings.noisePerHexDec==0 ? fnHtmlHex(posLnk.noisePer, 2, false) : fnHtmlDec(posLnk.noisePer, 2, true);
            var hexNoiseSlide = settings.noiseSlideHexDec==0 ? fnHtmlHex(Math.abs(posLnk.noiseSlide), 2, true) : fnHtmlDec(Math.abs(posLnk.noiseSlide), 2, true);
            var hexEnvSlide = settings.envSlideHexDec==0 ? fnHtmlHex(Math.abs(posLnk.envSlide), 4, true) : fnHtmlDec(Math.abs(posLnk.envSlide), 4, true);
            var hexNoteSlide = settings.toneSlideHexDec==0 ? fnHtmlHex(Math.abs(posLnk.noteSlide), 4, true) : fnHtmlDec(Math.abs(posLnk.noteSlide), 4, true);
            html += '<div class="pos sampler-pos" data-pos="' + pos + '">';
            html +=      '<div class="pos-id">' +  (settings.posHexDec==0 ? fnHtmlHex(pos, 2, true) : fnHtmlDec(pos, 2, true)) + '</div>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            //--- sample mixing TNEO
            html +=      '<div class="mix">';
            html +=          '<div class="t ' + (posLnk.mixT ? 'on' : '') + '">T</div>';
            html +=          '<div class="n ' + (posLnk.mixN ? 'on' : '') + '">N</div>';
            html +=          '<div class="e ' + (posLnk.mixE ? 'on' : '') + '">E</div>';
            html +=          '<div class="o ' + (posLnk.mixO ? 'on' : '') + '">O</div>';
            html +=      '</div>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            //--- sample env period
            html +=      '<span class="f env-per env-per-0">' + hexEnvPer[0] + '</span>';
            html +=      '<span class="env-per env-per-1">' + hexEnvPer[1] + '</span>';
            html +=      '<span class="env-per env-per-2">' + hexEnvPer[2] + '</span>';
            html +=      '<span class="env-per env-per-3">' + hexEnvPer[3] + '</span>';
            //--- sample env note
            html +=      '<span class="m f env-note">---</span>';
            //--- sample env form
            html +=      '<span class="m f env-form">' + fnHtmlHex(posLnk.envForm, 1, false) + '</span>';
            //--- sample env slide
            html +=      '<div class="m env-slide env-slide-sign">' + (posLnk.envSlide >=0 ? '+' : '-') + '</div>';
            html +=      '<span class="f env-slide env-slide-0" data-slide-pos="0">' + hexEnvSlide[0] + '</span>';
            html +=      '<span class="env-slide env-slide-1" data-slide-pos="1">' + hexEnvSlide[1] + '</span>';
            html +=      '<span class="env-slide env-slide-2" data-slide-pos="2">' + hexEnvSlide[2] + '</span>';
            html +=      '<span class="env-slide env-slide-3" data-slide-pos="3">' + hexEnvSlide[3] + '</span>';
            html +=      '<div class="env-slide env-slide-type slide-type">' + (posLnk.envSlideType==SLIDE_TYPE_ABS ? '_' : '^') + '</div>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            //--- sample noise perios
            html +=      '<span class="f noise noise-0">' + htmlNoisePer[0] + '</span>';
            html +=      '<span class="noise noise-1">' + htmlNoisePer[1] + '</span>';
            //--- sample noise slide
            html +=      '<div class="m noise-slide noise-slide-sign">' + (posLnk.noiseSlide >=0 ? '+' : '-') + '</div>';
            html +=      '<span class="f noise-slide noise-slide-0" data-slide-pos="0">' + hexNoiseSlide[0] + '</span>';
            html +=      '<span class="noise-slide noise-slide-1" data-slide-pos="1">' + hexNoiseSlide[1] + '</span>';
            html +=      '<div class="noise-slide noise-slide-type slide-type">' + (posLnk.noiseSlideType==SLIDE_TYPE_ABS ? '_' : '^') + '</div>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            //--- sample note
            html +=      '<span class="f note">' + fnHtmlNote(posLnk.note, posLnk.noteOctave) + '</span>';
            //--- sample note slider
            html +=      '<div class="m note-slide note-slide-sign">' + (posLnk.noteSlide >=0 ? '+' : '-') + '</div>';
            html +=      '<span class="f note-slide note-slide-0" data-slide-pos="0">' + hexNoteSlide[0] + '</span>';
            html +=      '<span class="note-slide note-slide-1" data-slide-pos="1">' + hexNoteSlide[1] + '</span>';
            html +=      '<span class="note-slide note-slide-2" data-slide-pos="2">' + hexNoteSlide[2] + '</span>';
            html +=      '<span class="note-slide note-slide-3" data-slide-pos="3">' + hexNoteSlide[3] + '</span>';
            html +=      '<div class="note-slide note-slide-type slide-type">' + (posLnk.noteSlideType==SLIDE_TYPE_ABS ? '_' : '^') + '</div>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            //--- volume
            html +=      '<div class="f volume volume-3">';
            for (var i = 0; i < 16; i++) {
                html +=      '<div class="vol vol-' + i + ( i <= posLnk.volume ? ' on' : '') + '" data-vol-id="' + i + '"></div>';
            }
            html +=      '</div>';
            html +=      '<span class="t m f vol">' + fnHtmlHex(posLnk.volume, 1, true) + '</span>';
            html +=      '<div class="sep"><b>&nbsp;</b></div>';
            html +=      '<div class="lopp">&nbsp;</div>';
            html += '</div>';
        }
    }
    html += '<div class="sampler-section sampler-section-end"><div class="name"><span>&nbsp;</span>lp2e</div></div>';
    $('.sampler').html(html);
    $('#sampler-size-atk').val(module.samples[sampleId].sizeAttack);
    $('#sampler-size-sus').val(module.samples[sampleId].sizeSuspend);
    $('#sampler-size-rel').val(module.samples[sampleId].sizeRelease);
    $('#sampler-size-lp2').val(module.samples[sampleId].sizeLoop2);
}

function fnRenderISOEditor() {
    fnRenderEditSample();
    fnRenderEditOrn();
    fnRenderEditPlay();
}

/*$(document).ready(function(){
    $( ".sampler" ).sortable({
        axis: "y",
        revert: false,
        cancel: "div.sampler-pos,div.sampler-section-attack",
        containment: "parent"
    });
});*/

//--- sampler ctrl volume
$(document).on('mousedown mouseenter', '.sampler .volume .vol', function(e) {
    if (e.buttons == 1) {
        var vol = parseInt($(this).attr('data-vol-id'));
        var volPos = $(this).parents('.volume').first();
        volPos.find('div').each(function(pos) {
            if (pos <= vol) {
                $(this).addClass('on');
            } else {
                $(this).removeClass('on');
            }
        });
        volPos.next('span.vol').html(dictHex[vol]);
        var pos = parseInt($(this).parents('.pos').first().attr('data-pos'));
        module.samples[currSample].positions[pos].volume = vol;
    }
});

//--- sampler ctrl mix
function fnSamplerChangeMIX(elem) {
    elem.toggleClass('on');
    var val = fnParseInt(elem.hasClass('on'));
    var pos = parseInt(elem.parents('.pos').first().attr('data-pos'));
    if (elem.hasClass('t')) {
        module.samples[currSample].positions[pos].mixT = val;
    } else if (elem.hasClass('n')) {
        module.samples[currSample].positions[pos].mixN = val;
    } else if (elem.hasClass('e')) {
        module.samples[currSample].positions[pos].mixE = val;
    } else if (elem.hasClass('o')) {
        module.samples[currSample].positions[pos].mixO = val;
    }
}
$(document).on('mousedown mouseenter', '.sampler div.mix div', function(e){
    if (e.which == 1) {
        fnSamplerChangeMIX($(this));
    }
});

var lastTimeNextReg = performance.now();
var fpsTimer = 0;

//--- ctlr play
var playCtrl = {
    state: 0,
    type: PLAY_TYPE_TRACK,
    posCounter: 0,
    posSpeed: 3,
    mix: [],
};
for (var chip = 0; chip < 3; chip++) {
    playCtrl.mix[chip] = {
        mixT: [1, 1, 1],
        mixN: [1, 1, 1],
        mixE: [1, 1, 1],
    };
}

//--- sample ctlr play
var smplPlayCtrl = [];
for (var ch = 0; ch < 3; ch++) {
    smplPlayCtrl[ch] = {
        currSample: 0,
        //---
        state: 0,
        pos: 0,
        baseNote: 0,
        baseOctave : 0,
        baseNoisePer: 0,
        baseEnvPer: 0,
        baseEnvForm: 0,
        baseVolume: 0,
        baseNoisePerSlide: 0,
        baseEnvPerSlide: 0,
        baseTonePerSlide: 0,
    };
}

//--- ornament ctlr play
var ornPlayCtrl = [];
for (var ch = 0; ch < 3; ch++) {
    ornPlayCtrl[ch] = {
        currOrnament: 0,
        //---
        state: 0,
        pos: 0,
        baseSlide: 0,
    };
}

function fnSamplerPlayRepaint(clSmplPlayCtrl, clOrnPlayCtrl) {
    //document.title = fpsTimer;
    $('.sampler-pos').removeClass('curr-pos');
    $('.sampler-pos').eq(clSmplPlayCtrl.pos).addClass('curr-pos');
    $('.sampler-orn-pos').removeClass('curr-pos');
    $('.sampler-orn-pos').eq(clOrnPlayCtrl.pos).addClass('curr-pos');
}
function fnPlayRegProvider() {
    var chip = 0;
    if (playCtrl.type == PLAY_TYPE_TRACK || playCtrl.type == PLAY_TYPE_PATT || playCtrl.type == PLAY_TYPE_PATT_POS) {
        if (playCtrl.posCounter == 0) {
            var posLnk = module.patterns[currPattern].positions[currPattPos];
            for (var ch = 0; ch < 3; ch++) {
                if (posLnk.envPer != 0) { smplPlayCtrl[ch].baseEnvPer = posLnk.envPer; }
                if (posLnk.envForm != 0) { smplPlayCtrl[ch].baseEnvForm = posLnk.envForm; }
                if (posLnk.noisePer != 0) { smplPlayCtrl[ch].baseNoisePer = posLnk.noisePer; }
                if (posLnk.channels[ch].volume != 0) { smplPlayCtrl[ch].baseVolume = posLnk.channels[ch].volume; }
                var smplChanged = false;
                var ornChanged = false;
                if (posLnk.channels[ch].sample != 0 && posLnk.channels[ch].sample != smplPlayCtrl[ch].currSample) {
                    smplPlayCtrl[ch].currSample = posLnk.channels[ch].sample;
                    smplChanged = true;
                }
                if (posLnk.channels[ch].ornament != 0 && posLnk.channels[ch].ornament != ornPlayCtrl[ch].currOrnament) {
                    ornPlayCtrl[ch].currOrnament = posLnk.channels[ch].ornament;
                    ornChanged = true;
                }
                if (posLnk.channels[ch].note != 0 || posLnk.channels[ch].noteOctave != 0) {
                    smplPlayCtrl[ch].baseNote = posLnk.channels[ch].note;
                    smplPlayCtrl[ch].baseOctave = posLnk.channels[ch].noteOctave;
                    smplChanged = true;
                }
                if (smplChanged) {
                    smplPlayCtrl[ch].state = 1;
                    smplPlayCtrl[ch].pos = 0;
                    smplPlayCtrl[ch].baseNoisePerSlide = 0;
                    smplPlayCtrl[ch].baseEnvPerSlide = 0;
                    smplPlayCtrl[ch].baseTonePerSlide = 0;
                }
                if (smplChanged || ornChanged) {
                    ornPlayCtrl[ch].state = 1;
                    ornPlayCtrl[ch].pos = 0;
                    ornPlayCtrl[ch].baseSlide = 0;
                }
            }
        }
        if (playCtrl.type == PLAY_TYPE_TRACK || playCtrl.type == PLAY_TYPE_PATT) {
            playCtrl.posCounter++;
            if (playCtrl.posCounter >= playCtrl.posSpeed) {
                playCtrl.posCounter = 0;
                currPattPos++;
                if (currPattPos >= module.patterns[currPattern].size ) {
                    currPattPos = 0;
					if (playCtrl.type == PLAY_TYPE_TRACK) {
						currTrackPos++;
						if (currTrackPos >= module.track.length) {
							currTrackPos = 0;
						}
						$('div.track-pos.active').removeClass('active');
						$('div#track-pos-' + currTrackPos).addClass('active');
						currPattern = module.track[currTrackPos];
						setTimeOut(function(){fnRenderPattern();},10);
					}
                }
                setTimeout(function() {
                    divPattern.css('transition', '0ms');
                    divPattern.css('transform', 'translate3d(0px,' + fnPattScrollValue() + 'px,0px)');
                }, 1);
            }
        } else if (playCtrl.type == PLAY_TYPE_PATT_POS) {
            playCtrl.posCounter = -1;
        }
    }


    for (var ch = 0; ch < 3; ch++) {
        //--- check exec rate
        var currTimeNextReg = performance.now();
        fpsTimer = (currTimeNextReg - lastTimeNextReg).toFixed(4);
        lastTimeNextReg = currTimeNextReg;
        //--- sampler repaint
        setTimeout(function(){fnSamplerPlayRepaint(cloneObj(smplPlayCtrl[1]), cloneObj(ornPlayCtrl[1]));}, 1);
        //--- process ornament
        var ornVal = 0;
        if (ornPlayCtrl[ch].state == 1 && ornPlayCtrl[ch].currOrnament != 0) {
            var ornLnk = module.ornaments[ornPlayCtrl[ch].currOrnament];
            if (ornPlayCtrl[ch].pos < ornLnk.size) {
                var posLnk = ornLnk.positions[ornPlayCtrl[ch].pos];
                ornVal = ornPlayCtrl[ch].baseSlide + posLnk.noteSlide;
                if (posLnk.noteSlideType == SLIDE_TYPE_REL) {
                    ornPlayCtrl[ch].baseSlide = ornVal;
                }
                ornPlayCtrl[ch].pos++;
                //--- check lp1
                if (ornPlayCtrl[ch].state == 1) {
                    if (ornPlayCtrl[ch].pos >= ornLnk.sizeAttack + ornLnk.sizeSuspend) {
                        if (ornLnk.sizeSuspend > 0) {
                            ornPlayCtrl[ch].pos = ornLnk.sizeAttack;
                        } else {
                            ornPlayCtrl[ch].state = 2;
                        }
                    }
                }
                //--- check lp2
                if (ornPlayCtrl[ch].state == 2) {
                    if (ornPlayCtrl[ch].pos >= ornLnk.sizeAttack + ornLnk.sizeSuspend + ornLnk.sizeRelease + ornLnk.sizeLoop2) {
                        if (ornLnk.sizeLoop2 > 0) {
                            ornPlayCtrl[ch].pos = ornLnk.sizeAttack + ornLnk.sizeSuspend + ornLnk.sizeRelease;
                        } else {
                            ornPlayCtrl[ch].state = 3;
                        }
                    }
                }
            } else {
                ornPlayCtrl[ch].pos++;
                ornPlayCtrl[ch].state = 0;
            }
        }
        //--- process sample
        if (smplPlayCtrl[ch].state != 0) {
            var sLnk = module.samples[smplPlayCtrl[ch].currSample];
            if (smplPlayCtrl[ch].pos < sLnk.size) {
                var posLnk = sLnk.positions[smplPlayCtrl[ch].pos];
                //--- base note/octave;
                var note = smplPlayCtrl[ch].baseNote;
                var octave = smplPlayCtrl[ch].baseOctave;
                if (sLnk.positions[smplPlayCtrl[ch].pos].note + sLnk.positions[smplPlayCtrl[ch].pos].noteOctave != 0) {
                    note = sLnk.positions[smplPlayCtrl[ch].pos].note;
                    octave = sLnk.positions[smplPlayCtrl[ch].pos].noteOctave;
                }
                //--- apply ornament;
                if (posLnk.mixO && ornVal != 0) {
                    var ornValOctave = Math.floor(ornVal / 12);
                    var ornValNote = ornVal % 12;
                    octave += ornValOctave;
                    note += ornValNote;
                    if (note < 0) {
                        note += 12;
                        octave--;
                    } else if (note >= 12) {
                        note -= 12;
                        octave++;
                    }
                    if (octave > 11) {octave = 11;}
                    if (octave < 0) {octave = 0;}
                }
                var tonePer = dictNoteTable[settings.dictNoteTableId][octave * 12 + note];

                //--- tonePer slider
                tonePer += smplPlayCtrl[ch].baseTonePerSlide + posLnk.noteSlide;
                if (posLnk.noteSlideType == SLIDE_TYPE_REL) {
                    smplPlayCtrl[ch].baseTonePerSlide += posLnk.noteSlide;
                }
                //--- noisePer
                var noisePer = smplPlayCtrl[ch].baseNoisePer;
                if (posLnk.noisePer != 0) {
                    noisePer = posLnk.noisePer;
                }
                //--- noisePer slider
                noisePer += smplPlayCtrl[ch].baseNoisePerSlide + posLnk.noiseSlide;
                if (posLnk.noiseSlideType == SLIDE_TYPE_REL) {
                    smplPlayCtrl[ch].baseNoisePerSlide += posLnk.noiseSlide;
                }
                //--- envPer
                var envPer = smplPlayCtrl[ch].baseEnvPer;
                if (posLnk.envPer != 0) {
                    envPer = posLnk.envPer;
                }
                //--- envPer slider
                envPer += smplPlayCtrl[ch].baseEnvPerSlide + posLnk.envSlide;
                if (posLnk.envSlideType == SLIDE_TYPE_REL) {
                    smplPlayCtrl[ch].baseEnvPerSlide += posLnk.envSlide;
                }
                //--- envForm
                var envForm = smplPlayCtrl[ch].baseEnvForm;
                if (posLnk.envForm != 0) {
                    envForm = posLnk.envForm;
                }
                //--- volume
                var volume = posLnk.volume - (15 - smplPlayCtrl[ch].baseVolume);
                if (volume < 0) { volume = 0;}

                //--- write to REGS
                playChipReg[chip].noisePer = noisePer;
                playChipReg[chip].envPer = envPer;
                playChipReg[chip].tonePer[ch] = tonePer;
                playChipReg[chip].mixTone[ch] = posLnk.mixT & playCtrl.mix[chip].mixT[ch];
                playChipReg[chip].mixNoise[ch] = posLnk.mixN & playCtrl.mix[chip].mixN[ch];
                playChipReg[chip].mixEnv[ch] = posLnk.mixE & playCtrl.mix[chip].mixE[ch];
                playChipReg[chip].vol[ch] = volume;// + 16*posLnk.mixE;
                playChipReg[chip].envForm = envForm;

                smplPlayCtrl[ch].pos++;
                //--- check lp1
                if (smplPlayCtrl[ch].state == 1) {
                    if (smplPlayCtrl[ch].pos >= sLnk.sizeAttack + sLnk.sizeSuspend) {
                        if (sLnk.sizeSuspend > 0) {
                            smplPlayCtrl[ch].pos = sLnk.sizeAttack;
                        } else {
                            smplPlayCtrl[ch].state = 2;
                        }
                    }
                }
                //--- check lp2
                if (smplPlayCtrl[ch].state == 2) {
                    if (smplPlayCtrl[ch].pos >= sLnk.sizeAttack + sLnk.sizeSuspend + sLnk.sizeRelease + sLnk.sizeLoop2) {
                        if (sLnk.sizeLoop2 > 0) {
                            smplPlayCtrl[ch].pos = sLnk.sizeAttack + sLnk.sizeSuspend + sLnk.sizeRelease;
                        } else {
                            smplPlayCtrl[ch].state = 3;
                        }
                    }
                }
            } else {
                smplPlayCtrl[ch].pos++;
                smplPlayCtrl[ch].state = 0;
            }
        } else {
            smplPlayCtrl[ch].state = 0;
            //playChipReg[chip].noisePer = 0;
            //playChipReg[chip].envPer = 0;
            playChipReg[chip].tonePer[ch] = 0;
            playChipReg[chip].mixTone[ch] = 0;
            playChipReg[chip].mixNoise[ch] = 0;
            playChipReg[chip].mixEnv[ch] = 0;
            playChipReg[chip].vol[ch] = 0;
            //playChipReg[chip].envForm = 0;
        }
    }
    return playChipReg;
}

function fnStop() {
    aymPlayer.stop();
    playCtrl.state = 0;
    $('.play-block').css('display', 'none');
}
function fnPlay(playType) {
    if (playCtrl.state == 0) {
        $('.play-block').css('display', 'block');
        playCtrl.state = 1;
        playCtrl.type = playType;
        playCtrl.posCounter = 0;
        resetPlayChipReg();
        for (ch = 0; ch < 3; ch++) {
            smplPlayCtrl[ch].currSample = 0;
            smplPlayCtrl[ch].state = 0;
            smplPlayCtrl[ch].pos = 0;
            smplPlayCtrl[ch].baseNote = editPlayNote;
            smplPlayCtrl[ch].baseOctave = editPlayOctave;
            smplPlayCtrl[ch].baseNoisePer = editPlayNoisePer;
            smplPlayCtrl[ch].baseEnvPer = editPlayEnvPer;
            smplPlayCtrl[ch].baseEnvForm = editPlayEnvForm;
            smplPlayCtrl[ch].baseVolume = editPlayVolume;
            smplPlayCtrl[ch].baseNoisePerSlide = 0;
            smplPlayCtrl[ch].baseEnvPerSlide = 0;
            smplPlayCtrl[ch].baseTonePerSlide = 0;
            //---
            ornPlayCtrl[ch].currOrnament = 0;
            ornPlayCtrl[ch].state = 0;
            ornPlayCtrl[ch].pos = 0;
            ornPlayCtrl[ch].baseSlide = 0;
        }
        aymPlayer.play();
    }
}

function fnSamplerPlay() {
    $('.sampler-pos').removeClass('curr-pos');
    $('.sampler-pos').first().addClass('curr-pos');
    playCtrl.state = 1;
    playCtrl.type = PLAY_TYPE_SAMPLE;
    playCtrl.posCounter = 0;
    resetPlayChipReg();
    for (ch = 0; ch < 3; ch++) {
        smplPlayCtrl[ch].currSample = currSample;
        smplPlayCtrl[ch].state = ch == 1 ? 1 : 0;
        smplPlayCtrl[ch].pos = 0;
        smplPlayCtrl[ch].baseNote = editPlayNote;
        smplPlayCtrl[ch].baseOctave = editPlayOctave;
        smplPlayCtrl[ch].baseNoisePer = editPlayNoisePer;
        smplPlayCtrl[ch].baseEnvPer = editPlayEnvPer;
        smplPlayCtrl[ch].baseEnvForm = editPlayEnvForm;
        smplPlayCtrl[ch].baseVolume = editPlayVolume;
        smplPlayCtrl[ch].baseNoisePerSlide = 0;
        smplPlayCtrl[ch].baseEnvPerSlide = 0;
        smplPlayCtrl[ch].baseTonePerSlide = 0;
        //---
        ornPlayCtrl[ch].currOrnament = currOrnament;
        ornPlayCtrl[ch].state = ch == 1 ? 1 : 0;
        ornPlayCtrl[ch].pos = 0;
        ornPlayCtrl[ch].baseSlide = 0;
    }
    aymPlayer.play();
}
function fnSamplerPlayRelease() {
    for (ch = 0; ch < 3; ch++) {
        if (smplPlayCtrl[ch].state == 1) {
            smplPlayCtrl[ch].state = 2;
        }
        if (ornPlayCtrl[ch].state == 1) {
            ornPlayCtrl[ch].state = 2;
        }
    }
}
function fnSamplerPlayOff() {
    fnStop();
}
$(document).on('mousedown', '#sampler-play-btn', function(){
    fnSamplerPlay();
});
$(document).on('mouseup mouseout', '#sampler-play-btn', function(){
    if (smplPlayCtrl[1].state != 0) {
        fnSamplerPlayRelease();
    }
});

function fnPattScrollValue() {
    return -14*(currPattPos-17);
}
function fnRenderTrack() {
    var html = '';
    $.each(module.track, function(pos, patternId){
        html += ''
            + '<div id="track-pos-' + pos + '" class="track-pos' + (currTrackPos==pos ? ' active' : '') + '">'
            +   '<input type="text" class="track-pos-id" value="' + patternId + '" />'
            +   '<input type="text" class="track-pos-name" value="' + module.patterns[patternId].name + '" />'
            + '</div>';
    });
    divTrack.html(html);
}


settings.colors = {};

settings.colors.workspaceBg = '161616';
settings.colors.workspaceText = 'E8E8E8';

settings.colors.pattPosText = '949494';
settings.colors.pattPosHighlightText = 'FFFFFF';
settings.colors.pattText = '676767';
settings.colors.pattHighlightBg = '282828';
settings.colors.pattHighlightText = 'D0D0D0';
settings.colors.pattLines = '323232';

settings.sizes = {};
//settings.sizes.textWidth = 8; //7+1 space
//settings.sizes.textHeight = 10; //7+1 space
settings.sizes.lineHeight = 14;

function fnRenderPattern() {
	/*
    //--- render canvas
    var patternId = module.track[currTrackPos];
    var pattLnk = module.patterns[patternId];
    var canvas = document.getElementById('c-pattern');
    canvas.height = settings.sizes.lineHeight * pattLnk.size;
    var context = canvas.getContext('2d');
    context.textBaseline = 'middle';
    context.font = 'bold 12px SegoeUIMonoRegular';

    for (var pos = 0; pos < pattLnk.size; pos++) {
        var posLnk = pattLnk.positions[pos];
        var y = settings.sizes.lineHeight * (pos + 1);
        var textY = y - (settings.sizes.lineHeight / 2);
        if (pos%4 == 0) {
            context.fillStyle = '#' + settings.colors.pattHighlightBg;
            context.fillRect(0, (y - settings.sizes.lineHeight), 600, y);
            context.fillStyle = '#' + settings.colors.pattHighlightText;
        } else {
            context.fillStyle = '#' + settings.colors.workspaceBg;
            context.fillRect(0, (y - settings.sizes.lineHeight), 600, y);
            context.fillStyle = '#' + settings.colors.pattText;
        }
        var htmlPos = settings.posHexDec == 0 ? fnHtmlHex(pos, 2, true) : fnHtmlDec(pos, 2, true);
        var hexEnvPer = fnHtmlHex(posLnk.envPer, 4, false);
        var htmlNoisePer = settings.noisePerHexDec==0 ? fnHtmlHex(posLnk.noisePer, 2, false) : fnHtmlDec(posLnk.noisePer, 2, true);
        context.fillText(htmlPos, 8, textY);
        context.fillStyle = '#' + (pos%4 == 0 ? settings.colors.pattHighlightText : settings.colors.pattText);
        context.fillText(hexEnvPer, 38, textY);
        context.fillText('---', 76, textY);
        context.fillText(dictEnvForm[posLnk.envForm], 104, textY);
        context.fillText(htmlNoisePer, 127, textY);
        for (ch = 0; ch < 3; ch++) {
            var x = 158 + ch*118;
            context.fillText(fnHtmlNote(posLnk.channels[ch].note, posLnk.channels[ch].noteOctave), x, textY);
            context.fillText(dictISOValues[posLnk.channels[ch].instrument], x + 28, textY);
            context.fillText(dictISOValues[posLnk.channels[ch].sample], x + 36, textY);
            context.fillText(dictISOValues[posLnk.channels[ch].ornament], x + 44, textY);
            context.fillText(dictVolume[posLnk.channels[ch].volume], x + 58, textY);
            context.fillText('....', x + 70, textY);
        }
    }
    //--- lines
    context.fillStyle = '#' + settings.colors.workspaceBg;
    context.fillRect(26, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(114, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(144, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(262, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(380, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(498, 0, 10, settings.sizes.lineHeight * pattLnk.size);
    context.fillStyle = '#' + settings.colors.pattLines;
    context.fillRect(30, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(118, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(148, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(266, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(384, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    context.fillRect(502, 0, 2, settings.sizes.lineHeight * pattLnk.size);
    
    return;
	*/
    //--- render old
	divPattern.css('transition', '0ms');
	divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
    var html = '';
    var patternId = module.track[currTrackPos];
    var pattLnk = module.patterns[patternId];
    var patternSize = pattLnk.size;
    for (var pos = 0; pos < patternSize; pos++) {
        posLnk = pattLnk.positions[pos];
        var hexEnvPer = fnHtmlHex(posLnk.envPer, 4, false);
        var htmlNoisePer = settings.noisePerHexDec==0 ? fnHtmlHex(posLnk.noisePer, 2, false) : fnHtmlDec(posLnk.noisePer, 2, true);
        html += ''
            + '<div class="pos pattern-pos' + (pos%4 == 0 ? ' highlight' : '') + '" id="pos-' + pos + '" data-pos="' + pos + '">'
            +   '<div class="pattern-pos-id">' + (settings.posHexDec==0 ? fnHtmlHex(pos, 2, true) : fnHtmlDec(pos, 2, true)) + '</div>'
            +   '<div class="sep"><b>&nbsp;</b></div>'
            +       '<span class="f env-per env-per-0">' + hexEnvPer[0] + '</span>'
            +       '<span class="f env-per env-per-1">' + hexEnvPer[1] + '</span>'
            +       '<span class="f env-per env-per-2">' + hexEnvPer[2] + '</span>'
            +       '<span class="f env-per env-per-3">' + hexEnvPer[3] + '</span>'
            +       '<span class="f space env-note">---</span>'
            +       '<span class="f space env-form">' + dictEnvForm[posLnk.envForm] + '</span>'
            +   '<div class="sep"><b>&nbsp;</b></div>'
            +       '<span class="f noise noise-0">' + htmlNoisePer[0] + '</span>'
            +       '<span class="f noise noise-1">' + htmlNoisePer[1] + '</span>'
            +   '<div class="sep"><b>&nbsp;</b></div>';
            //--- channels
            for (ch = 0; ch < 3; ch++) {
                html +=
                    '<span class="f note" data-ch="' + ch + '">' + fnHtmlNote(posLnk.channels[ch].note, posLnk.channels[ch].noteOctave) + '</span>'
                +   '<span class="f space ins" data-ch="' + ch + '">' + dictISOValues[posLnk.channels[ch].instrument] + '</span>'
                +   '<span class="sam" data-ch="' + ch + '">' + dictISOValues[posLnk.channels[ch].sample] + '</span>'
                +   '<span class="orn" data-ch="' + ch + '">' + dictISOValues[posLnk.channels[ch].ornament] + '</span>'
                +   '<span class="f space vol" data-ch="' + ch + '">' + dictVolume[posLnk.channels[ch].volume] + '</span>'
                +   '<span class="f space fx-0">.</span class="fx-1"><span class="fx-2">.</span><span class="fx-3">.</span><span class="fx-4">.</span>'
                +'<div class="sep"><b>&nbsp;</b></div>'

            }
            html +=
                    '<span class="f speed speed-0">.</span>'
            +       '<span class="speed speed-1">.</span>'
            + '</div>';
    }
    divPattern.html(html);
}

function fnRenderInstruments() {
    var htmlIns = '<div class="selector-item selected" data-selector-id="0">--- ins</div>';
    $(dictISOValues).each(function(id, value) {
        if (id != 0) {
            htmlIns += '<div class="selector-item" data-selector-id="' + id + '">' + value + ': </div>';
        }
    });
    $('div.instruments').html(htmlIns);
}

function fnRenderSamples() {
    var htmlSam = '<div class="selector-item" data-selector-id="0">--- sam</div>';
    $(dictISOValues).each(function(id, value) {
        if (id != 0) {
            htmlSam += '<div class="selector-item' + (id == currSample ? ' selected' : '') + '" data-selector-id="' + id + '">'
                + value + ': '
                + module.samples[id].name
                + '</div>';
        }
    });
    $('div.samples').html(htmlSam);
}

function fnRenderOrnaments() {
    var htmlOrn = '<div class="selector-item" data-selector-id="0">--- orn</div>';
    $(dictISOValues).each(function(id, value) {
        if (id != 0) {
            htmlOrn += '<div class="selector-item' + (id == currOrnament ? ' selected' : '') + '" data-selector-id="' + id + '">'
                + value + ': '
                + module.ornaments[id].name
                + '</div>';
        }
    });
    $('div.ornaments').html(htmlOrn);
}

function fnRenderLayers() {
    var htmlLay = '<div class="selector-item selected" data-selector-id="0">0: MASTER LAYER</div>';
    $(dictISOValues).each(function(id, value) {
        if (id != 0) {
            htmlLay += '<div class="selector-item" data-selector-id="' + id + '">' + value + ': </div>';
        }
    });
    $('div.layers').html(htmlLay);
}

function fnRenderTracker() {
    fnRenderTrack();
    fnRenderPattern();
    fnRenderInstruments();
    fnRenderSamples();
    fnRenderOrnaments();
    fnRenderLayers();
}

function fnSetSliderType(curr) {
    var activeBlockContainer = curr.parents('.block-container').first();
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var slideType;
    if (activeBlockContainer.hasClass('sampler-orn-container')) {
        slideType = module.ornaments[currOrnament].positions[currPosId].noteSlideType ^= 1;
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        if (curr.hasClass('note-slide-type')) {
            slideType = module.samples[currSample].positions[currPosId].noteSlideType ^= 1;
        } else if (curr.hasClass('noise-slide-type')) {
            slideType = module.samples[currSample].positions[currPosId].noiseSlideType ^= 1;
        } else if (curr.hasClass('env-slide-type')) {
            slideType = module.samples[currSample].positions[currPosId].envSlideType ^= 1;
        }
    }
    curr.html(slideType == 0 ? '_' : '^');
}


function fnSetNoiseSldSign(activeBlockContainer, curr, sign) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_sign = curr.prevAll('div.noise-slide-sign').first();
    var value = Math.abs(module.samples[currSample].positions[currPosId].noiseSlide);
    if (value == 0) {
        sign = '+';
    }
    curr_sign.html(sign);
    module.samples[currSample].positions[currPosId].noiseSlide = (sign == '+' || value == 0 ? 1 : -1) * value;
}
function fnSetNoiseSld(activeBlockContainer, curr, val, slideHexDec) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_0 = curr.hasClass('noise-slide-0') ? curr : curr.prevAll('span.noise-slide-0').first();
    var curr_1 = curr_0.next('span.noise-slide-1');
    var curr_type = curr_1.next('div.noise-slide-type');
    var curr_sign = curr_0.prev('div.noise-slide-sign');
    if (val == 'DEL') {
        curr_0.html('0');
        curr_1.html('0');
        return;
    } else {
        curr.html(slideHexDec==0 ? dictHex[val] : parseInt(val));
    }
    var val0 = parseInt(slideHexDec == 0 ? $.inArray(curr_0.html(), dictHex) : curr_0.html());
    var val1 = parseInt(slideHexDec == 0 ? $.inArray(curr_1.html(), dictHex) : curr_1.html());
    var mlt = slideHexDec == 0 ? 16 : 10;
    var value = val1 + val0*mlt;
    if (value == 0) {
        curr_sign.html('+');
    }
    module.samples[currSample].positions[currPosId].noiseSlide = (curr_sign.html() == '+' ? 1 : -1) * value;
}


function fnSetToneSldSign(activeBlockContainer, curr, sign) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_sign = curr.prevAll('div.note-slide-sign').first();
    var value = Math.abs(module.samples[currSample].positions[currPosId].noteSlide);
    if (value == 0) {
        sign = '+';
    }
    curr_sign.html(sign);
    module.samples[currSample].positions[currPosId].noteSlide = (sign == '+' || value == 0 ? 1 : -1) * value;
}
function fnSetToneSld(activeBlockContainer, curr, val, slideHexDec) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_0 = curr.hasClass('note-slide-0') ? curr : curr.prevAll('span.note-slide-0').first();
    var curr_1 = curr_0.next('span.note-slide-1');
    var curr_2 = curr_1.next('span.note-slide-2');
    var curr_3 = curr_2.next('span.note-slide-3');
    var curr_type = curr_1.next('div.note-slide-type');
    var curr_sign = curr_0.prev('div.note-slide-sign');
    if (val == 'DEL') {
        curr_0.html('0');
        curr_1.html('0');
        curr_2.html('0');
        curr_3.html('0');
        return;
    } else {
        curr.html(slideHexDec==0 ? dictHex[val] : parseInt(val));
    }
    var val0 = parseInt(slideHexDec == 0 ? $.inArray(curr_0.html(), dictHex) : curr_0.html());
    var val1 = parseInt(slideHexDec == 0 ? $.inArray(curr_1.html(), dictHex) : curr_1.html());
    var val2 = parseInt(slideHexDec == 0 ? $.inArray(curr_2.html(), dictHex) : curr_2.html());
    var val3 = parseInt(slideHexDec == 0 ? $.inArray(curr_3.html(), dictHex) : curr_3.html());
    var mlt = slideHexDec == 0 ? 16 : 10;
    var value = val3 + val2*mlt + val1*mlt*mlt + val0*mlt*mlt*mlt;
    if (value == 0) {
        curr_sign.html('+');
    }
    module.samples[currSample].positions[currPosId].noteSlide = (curr_sign.html() == '+' ? 1 : -1) * value;
}

function fnSetEnvSldSign(activeBlockContainer, curr, sign) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_sign = curr.prevAll('div.env-slide-sign').first();
    var value = Math.abs(module.samples[currSample].positions[currPosId].envSlide);
    if (value == 0) {
        sign = '+';
    }
    curr_sign.html(sign);
    module.samples[currSample].positions[currPosId].envSlide = (sign == '+' || value == 0 ? 1 : -1) * value;
}
function fnSetEnvSld(activeBlockContainer, curr, val, slideHexDec) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var curr_0 = curr.hasClass('env-slide-0') ? curr : curr.prevAll('span.env-slide-0').first();
    var curr_1 = curr_0.next('span.env-slide-1');
    var curr_2 = curr_1.next('span.env-slide-2');
    var curr_3 = curr_2.next('span.env-slide-3');
    var curr_type = curr_1.next('div.env-slide-type');
    var curr_sign = curr_0.prev('div.env-slide-sign');
    if (val == 'DEL') {
        curr_0.html('0');
        curr_1.html('0');
        curr_2.html('0');
        curr_3.html('0');
        return;
    } else {
        curr.html(slideHexDec==0 ? dictHex[val] : parseInt(val));
    }
    var val0 = parseInt(slideHexDec == 0 ? $.inArray(curr_0.html(), dictHex) : curr_0.html());
    var val1 = parseInt(slideHexDec == 0 ? $.inArray(curr_1.html(), dictHex) : curr_1.html());
    var val2 = parseInt(slideHexDec == 0 ? $.inArray(curr_2.html(), dictHex) : curr_2.html());
    var val3 = parseInt(slideHexDec == 0 ? $.inArray(curr_3.html(), dictHex) : curr_3.html());
    var mlt = slideHexDec == 0 ? 16 : 10;
    var value = val3 + val2*mlt + val1*mlt*mlt + val0*mlt*mlt*mlt;
    if (value == 0) {
        curr_sign.html('+');
    }
    module.samples[currSample].positions[currPosId].envSlide = (curr_sign.html() == '+' ? 1 : -1) * value;
}

function fnSetOrnSign(activeBlockContainer, curr, sign) {
    if (activeBlockContainer.hasClass('sampler-orn-container')) {
        var currPos = $(curr).parents('.pos');
        var currPosId = currPos.attr('data-pos');
        var curr_sign = curr.prevAll('div.orn-slide-sign').first();
        var ornVal = module.ornaments[currOrnament].positions[currPosId].noteSlide;
        curr_sign.html(Math.abs(ornVal) == 0 ? '+' : sign);
        module.ornaments[currOrnament].positions[currPosId].noteSlide = (sign == '+' || ornVal == 0 ? 1 : -1) * Math.abs(ornVal);
    }
}
function fnSetOrnSld(activeBlockContainer, curr, val) {
    if (activeBlockContainer.hasClass('sampler-orn-container')) {
        var currPos = $(curr).parents('.pos');
        var currPosId = currPos.attr('data-pos');
        var curr_0 = curr.hasClass('orn-slide-0') ? curr : curr.prev('span.orn-slide-0');
        var curr_1 = curr_0.next('span.orn-slide-1');
        var curr_type = curr_1.next('div.orn-slide-type');
        var curr_sign = curr_0.prev('div.orn-slide-sign');
        if (val == 'DEL') {
            curr_0.html(0);
            curr_1.html(0);
        } else {
            curr.html(dictHex[val]);
        }
        var ornVal = 10 * parseInt(curr_0.html()) + parseInt(curr_1.html());
        htmlOrnVal = fnHtmlDec(ornVal, 2, true);
        if (ornVal == 0) {
            curr_sign.html('+');
        }
        htmlOrnVal = fnHtmlDec(ornVal, 2, true);
        curr_0.html(htmlOrnVal[0]);
        curr_1.html(htmlOrnVal[1]);
        module.ornaments[currOrnament].positions[currPosId].noteSlide = (curr_sign.html() == '+' ? 1 : -1) * ornVal;
    }
}

function fnSetNoise(activeBlockContainer, curr, hexId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var noisePer = 0;
    var n_curr_0 = curr.hasClass('noise-0') ? curr : curr.prev('span.noise-0');
    var n_curr_1 = n_curr_0.next('span.noise-1');
    if (hexId != 'DEL') {
        curr.html(dictHex[hexId]);
        var n0 = $.inArray(n_curr_0.html(), dictHex) != -1 ? $.inArray(n_curr_0.html(), dictHex) : 0;
        var n1 = $.inArray(n_curr_1.html(), dictHex) != -1 ? $.inArray(n_curr_1.html(), dictHex) : 0;
        noisePer = (settings.noisePerHexDec == 0 ? 16 : 10) * parseInt(n0) + parseInt(n1);
    }
    if (noisePer > 31) {
        noisePer = 31;
    }
    htmlNoisePer = settings.noisePerHexDec == 0 ? fnHtmlHex(noisePer, 2, false) : fnHtmlDec(noisePer, 2, false);
    n_curr_0.html(htmlNoisePer[0]);
    n_curr_1.html(htmlNoisePer[1]);
    if (activeBlockContainer.hasClass('pattern-container')) {
        module.patterns[currPattern].positions[currPosId].noisePer = noisePer;
        fnPlay(PLAY_TYPE_PATT_POS);
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        module.samples[currSample].positions[currPosId].noisePer = noisePer;
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        editPlayNoisePer = noisePer;
        fnSamplerPlay();
    }
}

function fnSetEnvPer(activeBlockContainer, curr, hexId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var env_curr_0 = curr.hasClass('env-per-0') ? curr : curr.prevAll('span.env-per-0').first();
    var env_curr_1 = env_curr_0.next('span.env-per-1');
    var env_curr_2 = env_curr_1.next('span.env-per-2');
    var env_curr_3 = env_curr_2.next('span.env-per-3');
    var env_curr_note = curr.nextAll('span.env-note').first();
    if (hexId == 'DEL') {
        env_curr_0.html('.');
        env_curr_1.html('.');
        env_curr_2.html('.');
        env_curr_3.html('.');
    } else {
        curr.html(dictHex[hexId]);
        if (env_curr_0.html() == '.') { env_curr_0.html(0);}
        if (env_curr_1.html() == '.') { env_curr_1.html(0);}
        if (env_curr_2.html() == '.') { env_curr_2.html(0);}
        if (env_curr_3.html() == '.') { env_curr_3.html(0);}
    }
    var e0 = parseInt($.inArray(env_curr_0.html(), dictHex) != -1 ? $.inArray(env_curr_0.html(), dictHex) : 0);
    var e1 = parseInt($.inArray(env_curr_1.html(), dictHex) != -1 ? $.inArray(env_curr_1.html(), dictHex) : 0);
    var e2 = parseInt($.inArray(env_curr_2.html(), dictHex) != -1 ? $.inArray(env_curr_2.html(), dictHex) : 0);
    var e3 = parseInt($.inArray(env_curr_3.html(), dictHex) != -1 ? $.inArray(env_curr_3.html(), dictHex) : 0);
    var envPer = e3 + e2*16 + e1*16*16 + e0*16*16*16;
    //TODO set env note!!!
    if (activeBlockContainer.hasClass('pattern-container')) {
        module.patterns[currPattern].positions[currPosId].envPer = envPer;
        fnPlay(PLAY_TYPE_PATT_POS);
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        module.samples[currSample].positions[currPosId].envPer = envPer;
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        editPlayEnvPer = envPer;
        fnSamplerPlay();
    }
}

function fnSetEnvNoteOctave(activeBlockContainer, curr, octaveId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var currNote = curr.html().substr(0,2);
    var currNoteId = $.inArray(currNote, dictNote);
    if (currNoteId != -1) {
        if (activeBlockContainer.hasClass('pattern-container')) {
        } else if (activeBlockContainer.hasClass('sampler-container')) {
        } else if (activeBlockContainer.hasClass('sampler-play-container')) {
            fnSetEnvNote(activeBlockContainer, curr, currNoteId, octaveId);
            editPlayEnvOctave = octaveId;
        }
    }
}

function fnSetEnvNote(activeBlockContainer, curr, noteId, octaveId) {
    if (noteId == 'Sus') { return; }
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');



    if (activeBlockContainer.hasClass('pattern-container')) {

    } else if (activeBlockContainer.hasClass('sampler-container')) {
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        if (noteId == 'R--' || noteId == 'DEL') { return; }
        if (octaveId == undefined) {
            octaveId = editPlayEnvOctave;
        }

        curr.html(dictNote[noteId] + dictOctave[settings.dictOctaveId][octaveId]);
        var noteEnvPer = dictNoteTable[settings.dictNoteTableId][octaveId * 12 + noteId];
        if (noteEnvPer == undefined) {
            noteEnvPer = 0;
        }
        var htmlNotePer = fnHtmlHex(noteEnvPer, 4, false);
        currPos.find('span.env-per-0').html(htmlNotePer[0]);
        currPos.find('span.env-per-1').html(htmlNotePer[1]);
        currPos.find('span.env-per-2').html(htmlNotePer[2]);
        currPos.find('span.env-per-3').html(htmlNotePer[3]);

        editPlayEnvPer = noteEnvPer;

        fnSamplerPlay();
    }
}

function fnSetEnvForm(activeBlockContainer, curr, envFormId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    envFormId = envFormId == 'DEL' ? 0 : envFormId;
    curr.html(dictEnvForm[envFormId]);
    if (activeBlockContainer.hasClass('pattern-container')) {
        module.patterns[currPattern].positions[currPosId].envForm = envFormId;
        fnPlay(PLAY_TYPE_PATT_POS);
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        module.samples[currSample].positions[currPosId].envForm = envFormId;
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        editPlayEnvForm = envFormId;
        fnSamplerPlay();
    }
}

function fnSetVol(activeBlockContainer, curr, volId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    volId = volId=='DEL' ? 0 : volId;
    if (activeBlockContainer.hasClass('pattern-container')) {
        var currChId = curr.attr('data-ch');
        curr.html(dictVolume[volId]);
        module.patterns[currPattern].positions[currPosId].channels[currChId].volume = volId;
        currVolume = volId;
        fnPlay(PLAY_TYPE_PATT_POS);
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        curr.html(dictHex[volId]);
        module.samples[currSample].positions[currPosId].volume = volId;
        currPos.find('div.volume div.vol').each(function(pos){
            $(this).removeClass('on');
            if (pos <= volId) {
                $(this).addClass('on');
            }
        });
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        curr.html(dictHex[volId]);
        editPlayVolume = volId;
        fnSamplerPlay();
        currVolume = volId;
    }


}

function fnSetIns(curr, insId) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var currChId = curr.attr('data-ch');
    if (insId == 'DEL') {
        curr.html('.');
        module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = 0;
    } else {
        curr.html(dictISOValues[insId]);
        module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = insId;
    }
    fnPlay(PLAY_TYPE_PATT_POS);
}
function fnSetSmpl(curr, smplId) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var currChId = curr.attr('data-ch');
    if (smplId == 'DEL') {
        curr.html('.');
        module.patterns[currPattern].positions[currPosId].channels[currChId].sample = 0;
    } else {
        curr.html(dictISOValues[smplId]);
        module.patterns[currPattern].positions[currPosId].channels[currChId].sample = smplId;
    }
    setCurrSample(smplId);
    fnPlay(PLAY_TYPE_PATT_POS);
}
function fnSetOrn(curr, ornId) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var currChId = curr.attr('data-ch');
    if (ornId == 'DEL') {
        curr.html('.');
        module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = 0;
    } else {
        curr.html(dictISOValues[ornId]);
        module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = ornId;
    }
    fnPlay(PLAY_TYPE_PATT_POS);
}

function fnSetNote(activeBlockContainer, curr, noteId, octaveId) {
    var currPos = curr.parents('.pos');
    var currPosId = currPos.attr('data-pos');
    // pattern
    if (activeBlockContainer.hasClass('pattern-container')) {
        var currChId = curr.attr('data-ch');
        var span_i = curr.next('span.ins');
        var span_s = span_i.next('span.sam');
        var span_o = span_s.next('span.orn');
        var span_v = span_o.next('span.vol');
        if (noteId == 'R--') {
            curr.html('R--');
            span_i.html('.');
            span_s.html('.');
            span_o.html('.');
            span_v.html('.');
            module.patterns[currPattern].positions[currPosId].channels[currChId].note = 'R--';
            module.patterns[currPattern].positions[currPosId].channels[currChId].noteOctave = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].sample = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].volume = 0;
        } else if (noteId == 'DEL') {
            curr.html('---');
            span_i.html('.');
            span_s.html('.');
            span_o.html('.');
            span_v.html('.');
            module.patterns[currPattern].positions[currPosId].channels[currChId].note = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].noteOctave = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].sample = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].volume = 0;
        } else if (noteId == 'Sus') {
            curr.html('Sus');
            span_i.html('.');
            span_s.html('.');
            span_o.html('.');
            span_v.html('.');
            module.patterns[currPattern].positions[currPosId].channels[currChId].note = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].noteOctave = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].sample = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = 0;
            module.patterns[currPattern].positions[currPosId].channels[currChId].volume = 0;
        } else {
            curr.html(dictNote[noteId] + dictOctave[settings.dictOctaveId][octaveId]);
            module.patterns[currPattern].positions[currPosId].channels[currChId].note = noteId;
            module.patterns[currPattern].positions[currPosId].channels[currChId].noteOctave = octaveId;
            if (currInstrument != 0) {
                module.patterns[currPattern].positions[currPosId].channels[currChId].instrument = currInstrument;
                span_i.html(dictISOValues[currInstrument]);
            }
            if (currSample != 0) {
                module.patterns[currPattern].positions[currPosId].channels[currChId].sample = currSample;
                span_s.html(dictISOValues[currSample]);
            }
            if (currOrnament != 0) {
                module.patterns[currPattern].positions[currPosId].channels[currChId].ornament = currOrnament;
                span_o.html(dictISOValues[currOrnament]);
            }
            if (currVolume != 0) {
                module.patterns[currPattern].positions[currPosId].channels[currChId].volume = currVolume;
                span_v.html(dictVolume[currVolume]);
            }
        }
        fnPlay(PLAY_TYPE_PATT_POS);
    // sampler
    } else if (activeBlockContainer.hasClass('sampler-container')) {
        if (noteId == 'DEL') {
            curr.html('---');
            module.samples[currSample].positions[currPosId].note = 0;
            module.samples[currSample].positions[currPosId].noteOctave = 0;
        } else {
            module.samples[currSample].positions[currPosId].note = noteId;
            module.samples[currSample].positions[currPosId].noteOctave = octaveId;
            curr.html(dictNote[noteId] + dictOctave[settings.dictOctaveId][octaveId]);
        }
    } else if (activeBlockContainer.hasClass('sampler-play-container')) {
        if (noteId != 'DEL') {
            editPlayNote = noteId;
            curr.html(dictNote[editPlayNote] + dictOctave[settings.dictOctaveId][editPlayOctave]);
            if (playCtrl.state == 0 || (smplPlayCtrl[1].state == 0 || smplPlayCtrl[1].state >= 2) ) {
                fnSamplerPlay();
            }

        }
    }
}

function fnSetNoteOctave(activeBlockContainer, curr, octaveId) {
    var currPos = $(curr).parents('.pos');
    var currPosId = currPos.attr('data-pos');
    var currNote = curr.html().substr(0,2);
    if ($.inArray(currNote, dictNote) != -1) {
        curr.html(currNote + dictOctave[settings.dictOctaveId][octaveId]);
        if (activeBlockContainer.hasClass('pattern-container')) {
            var currChId = curr.attr('data-ch');
            module.patterns[currPattern].positions[currPosId].channels[currChId].noteOctave = octaveId;
            currOctave = octaveId;
            fnPlay(PLAY_TYPE_PATT_POS);
        } else if (activeBlockContainer.hasClass('sampler-container')) {
            module.samples[currSample].positions[currPosId].noteOctave = octaveId;
            currOctave = octaveId;
        } else if (activeBlockContainer.hasClass('sampler-play-container')) {
            editPlayOctave = octaveId;
            fnSamplerPlay();
        }
    }
}

function fnPosMoveUpDown(activeBlockContainer, direction, step) {
    var curr = fnGetCurr(activeBlockContainer, 'first');
    var currIdx = curr.prevAll('span').length;
    var currPos = curr.parents('.pos').first();
    var nextPosAll = direction == 'up' ? currPos.prevAll('.pos') : currPos.nextAll('.pos');
    if (nextPosAll.length) {
        var nextPos = step==0 || step > nextPosAll.length ? nextPosAll.last() : nextPosAll.eq(step - 1);
        curr.removeClass('curr');
        nextPos.find('span').eq(currIdx).addClass('curr');
    }
}

function fnPosMoveUp(activeBlockContainer, step) {
    fnPosMoveUpDown(activeBlockContainer, 'up', step)
}
function fnPosMoveDown(activeBlockContainer, step) {
    fnPosMoveUpDown(activeBlockContainer, 'down', step)
}

function fnScrollPatternUp(step) {
	currPattPos -= step;
	var patternId = module.track[currTrackPos];
	if (currPattPos < 0) {
		currPattPos += module.patterns[patternId].size;
	}
	divPattern.css('transition', '50ms');
	divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
	var curr = $('div.pattern span.curr');
	var curr_idx = curr.prevAll('span').length;
	var newln = $('div#pos-' + currPattPos).find('span').eq(curr_idx);
	curr.removeClass('curr');
	newln.addClass('curr');
}
function fnScrollPatternDown(step) {
	currPattPos += step;
	var patternId = module.track[currTrackPos];
	if (currPattPos >= module.patterns[patternId].size) {
		currPattPos -= module.patterns[patternId].size;
	}
	divPattern.css('transition', '50ms');
	divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
	var curr = $('div.pattern span.curr');
	var curr_idx = curr.prevAll('span').length;
	var newln = $('div#pos-' + currPattPos).find('span').eq(curr_idx);
	curr.removeClass('curr');
	newln.addClass('curr');
}

$(document).ready(function(){
    module = fnGetLastModule();
    divTrack = $('div.track');
    //divPattern = $('canvas.c-pattern');
	divPattern = $('.pattern');
    currPattern = module.track[0];
    fnRenderTracker();
    fnRenderISOEditor();
    requestAnimationFrame(fnRepaint);
});

$(document).on('click', '.pattern span', function(){
    if (!$(this).hasClass('patt-pos-id-span')) {
        currPattPos = parseInt($(this).parents('.pattern-pos').first().attr('data-pos'));
        $('.pattern span').removeClass('curr');
        $(this).addClass('curr');
        divPattern.css('transition', '200ms');
        divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
    }
});

/*--- CONTROL HELPERS ---*/
function fnGetActiveBlockContainer() {
    var activeBlockContainer = $('.block-container.active');
    if (activeBlockContainer.length == 0) {
        if ($('.layout-tracker').hasClass('selected')) {
            $('.pattern-container').addClass('active');
        } else if ($('.layout-sampler').hasClass('selected')) {
            $('.sampler-container').addClass('active');
        }
        activeBlockContainer = $('.block-container.active');
    }
    return activeBlockContainer;
}
function fnGetCurr(activeBlockContainer, orderFn) {
    var curr = activeBlockContainer.find('span.curr');
    if (curr.length == 0 && orderFn != undefined) {
        curr = orderFn == 'first' ? activeBlockContainer.find('div.pos span').first()
            : activeBlockContainer.find('div.pos span').last();
        curr.addClass('curr');
    }
    return curr;
}

/*--- KEYBOARD CONTROL - KEYDOWN ---*/
$(document).on('keydown', function(e){
    var keyCode = e.keyCode || e.which;
    var sender = e.target || e.srcElement;
    var activeBlockContainer = fnGetActiveBlockContainer();
    //--- disable keyboard control for input, textarea
    if (sender.tagName.match(/TEXTAREA/i)) {
        return;
    }
    if (sender.tagName.match(/INPUT/i) && keyCode != 13) {
        return;
    }
    //--- escape
    if (keyCode == 27) {
        $('.block-container').removeClass('active');
        $('span.curr').removeClass('curr');
        if (smplPlayCtrl[1].state != 0) {
            smplPlayCtrl[1].state = 3;
        }
        fnStop();
    }
    //--- enter
    if (keyCode == 13) {
        if (playCtrl.state == 0) {
            fnPlay(PLAY_TYPE_PATT);
        }
        e.preventDefault();
        return false;
    }
    //--- tab
    if (keyCode == 9) {
        e.preventDefault();
        return false;
    }

    //--- home + ctrl
    if (keyCode == 36 && e.ctrlKey) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            currPattPos = 0;
            divPattern.css('transition', '50ms');
            divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
            var curr = $('div.pattern span.curr');
            var curr_idx = curr.prevAll('span').length;
            var newln = $('div#pos-' + currPattPos).find('span').eq(curr_idx);
            curr.removeClass('curr');
            newln.addClass('curr');
        } else {
            fnPosMoveUp(activeBlockContainer, 0);
        }
        e.preventDefault();
        return false;
    }
    //--- end + ctrl
    if (keyCode == 35 && e.ctrlKey) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            var patternId = module.track[currTrackPos];
            currPattPos = module.patterns[patternId].size - 1;
            divPattern.css('transition', '50ms');
            divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
            var curr = $('div.pattern span.curr');
            var curr_idx = curr.prevAll('span').length;
            var newln = $('div#pos-' + currPattPos).find('span').eq(curr_idx);
            curr.removeClass('curr');
            newln.addClass('curr');
        } else {
            fnPosMoveDown(activeBlockContainer, 0);
        }
        e.preventDefault();
        return false;
    }
    //--- cursor down
    if (keyCode == 40) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            fnScrollPatternDown(1);
        } else {
            fnPosMoveDown(activeBlockContainer, 1);
        }
        e.preventDefault();
        return false;
    }
    //--- cursor up
    if (keyCode == 38) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            fnScrollPatternUp(1);
        } else {
            fnPosMoveUp(activeBlockContainer, 1);
        }
        e.preventDefault();
        return false;
    }
    //--- home
    if (keyCode == 36) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            var curr = $('div.pattern span.curr');
            if (curr.length) {
                var prev = curr.prevAll('span').last();
            } else {
                var prev =  $('div#pos-' + currPattPos).find('span').first();
            }
            if (prev.length > 0) {
                curr.removeClass('curr');
                prev.addClass('curr');
            }
        } else {
            var curr = fnGetCurr(activeBlockContainer, 'first');
            var prev = curr.prevAll('span' + (e.ctrlKey ? '.f' : '')).last();
            if (prev.length > 0) {
                curr.removeClass('curr');
                prev.addClass('curr');
            }
        }
        e.preventDefault();
        return false;
    }
    //--- end
    if (keyCode == 35) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            var curr = $('div.pattern span.curr');
            if (curr.length) {
                var next = curr.nextAll('span').last();
            } else {
                var next =  $('div#pos-' + currPattPos).find('span').last();
            }
            if (next.length > 0) {
                curr.removeClass('curr');
                next.addClass('curr');
            }
        } else {
            var curr = fnGetCurr(activeBlockContainer, 'first');
            var next = curr.nextAll('span' + (e.ctrlKey ? '.f' : '')).last();
            if (next.length > 0) {
                curr.removeClass('curr');
                next.addClass('curr');
            }
        }
        e.preventDefault();
        return false;
    }
    //--- cursor left
    if (keyCode == 37) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            var curr = $('div.pattern span.curr');
            if (curr.length) {
                var prev = curr.prevAll('span' + (e.ctrlKey ? '.f' : '')).first();
            } else {
                var prev =  $('div#pos-' + currPattPos).find('span').first();
            }
            if (prev.length > 0) {
                curr.removeClass('curr');
                prev.addClass('curr');
            }
        } else {
            var curr = fnGetCurr(activeBlockContainer, 'first');
            var prev = curr.prevAll('span' + (e.ctrlKey ? '.f' : '')).first();
            if (prev.length > 0) {
                curr.removeClass('curr');
                prev.addClass('curr');
            }
        }
        e.preventDefault();
        return false;
    }
    //--- cursor right
    if (keyCode == 39) {
        if (activeBlockContainer.hasClass('pattern-container')) {
            var curr = $('div.pattern span.curr');
            if (curr.length) {
                var next = curr.nextAll('span' + (e.ctrlKey ? '.f' : '')).first();
            } else {
                var next =  $('div#pos-' + currPattPos).find('span').first();
            }
            if (next.length > 0) {
                curr.removeClass('curr');
                next.addClass('curr');
            }
        } else {
            var curr = fnGetCurr(activeBlockContainer, 'first');
            var next = curr.nextAll('span' + (e.ctrlKey ? '.f' : '')).first();
            if (next.length > 0) {
                curr.removeClass('curr');
                next.addClass('curr');
            }
        }
        e.preventDefault();
        return false;
    }
    //--- page up
    if (keyCode == 33) {
		fnScrollPatternUp(e.ctrlKey ? 8 : 4);
        e.preventDefault();
        return false;
    }
    //--- page down
    if (keyCode == 34) {
		fnScrollPatternDown(e.ctrlKey ? 8 : 4);
        e.preventDefault();
        return false;
    }

    //--- get curr pos
    var curr = fnGetCurr(activeBlockContainer);
    //--- piano
    if (curr.length == 1 && (curr.hasClass('note') || curr.hasClass('env-note'))) {
        var fnNoteName = curr.hasClass('note') ? 'fnSetNote' : 'fnSetEnvNote';
        var octaveId = currOctave;
        
        //--- piano - z - C
        if (keyCode == 90) { window[fnNoteName](activeBlockContainer, curr, 0, octaveId); }
        //--- piano - s - C#
        if (keyCode == 83) { window[fnNoteName](activeBlockContainer, curr, 1, octaveId); }
        //--- piano - x - D
        if (keyCode == 88) { window[fnNoteName](activeBlockContainer, curr, 2, octaveId); }
        //--- piano - d - D#
        if (keyCode == 68) { window[fnNoteName](activeBlockContainer, curr, 3, octaveId); }
        //--- piano - c - E
        if (keyCode == 67) { window[fnNoteName](activeBlockContainer, curr, 4, octaveId); }
        //--- piano - v - F
        if (keyCode == 86) { window[fnNoteName](activeBlockContainer, curr, 5, octaveId); }
        //--- piano - g - F#
        if (keyCode == 71) { window[fnNoteName](activeBlockContainer, curr, 6, octaveId); }
        //--- piano - b - G
        if (keyCode == 66) { window[fnNoteName](activeBlockContainer, curr, 7, octaveId); }
        //--- piano - h - G#
        if (keyCode == 72) { window[fnNoteName](activeBlockContainer, curr, 8, octaveId); }
        //--- piano - n - A
        if (keyCode == 78) { window[fnNoteName](activeBlockContainer, curr, 9, octaveId); }
        //--- piano - j - A#
        if (keyCode == 74) { window[fnNoteName](activeBlockContainer, curr, 10, octaveId); }
        //--- piano - m - B
        if (keyCode == 77) { window[fnNoteName](activeBlockContainer, curr, 11, octaveId); }
        if (octaveId < 8) {
            //--- piano - , - C+1
            if (keyCode == 188) { window[fnNoteName](activeBlockContainer, curr, 0, octaveId + 1); }
            //--- piano - l - C#+1
            if (keyCode ==  76) { window[fnNoteName](activeBlockContainer, curr, 1, octaveId + 1); }
            //--- piano - . - D+1
            if (keyCode == 190) { window[fnNoteName](activeBlockContainer, curr, 2, octaveId + 1); }
            //--- piano - ; - D#+1
            if (keyCode == 186) { window[fnNoteName](activeBlockContainer, curr, 3, octaveId + 1); }
            //--- piano - / - E+1
            if (keyCode == 191) { window[fnNoteName](activeBlockContainer, curr, 4, octaveId + 1); }
        }
        //--- piano - del - DEL
        if (keyCode == 46) { window[fnNoteName](activeBlockContainer, curr,'DEL'); }
        if (activeBlockContainer.hasClass('pattern-container')) {
            //--- piano - a - R--
            if (keyCode == 65) { window[fnNoteName](activeBlockContainer, curr,'R--'); }
            //--- piano - f - Sus
            if (keyCode == 70) { window[fnNoteName](activeBlockContainer, curr,'Sus'); }
        }
        //--- octave
        var fnOctaveName = curr.hasClass('note') ? 'fnSetNoteOctave' : 'fnSetEnvNoteOctave';
        if (keyCode >= 48 && keyCode <= 56) {
            window[fnOctaveName](activeBlockContainer, curr, keyCode - 48);
        }
    }
    //--- ISO
    if (curr.hasClass('ins') || curr.hasClass('sam') || curr.hasClass('orn')) {
        fnName = 'fnSetIns';
        if (curr.hasClass('sam')) {
            fnName = 'fnSetSmpl';
        }
        if (curr.hasClass('orn')) {
            fnName = 'fnSetOrn';
        }
        //--- 1..9
        if (keyCode >= 49 && keyCode <= 57) {
            window[fnName](curr, keyCode - 48);
        }
        if (keyCode >= 97 && keyCode <= 105) {
            window[fnName](curr, keyCode - 96);
        }
        //--- A..Z
        if (keyCode >= 65 && keyCode <= 90) {
            window[fnName](curr, keyCode - 65 + 10);
        }
        //--- del
        if (keyCode == 46) { window[fnName](curr,'DEL'); }
        //--- 0
        if (keyCode == 48) { window[fnName](curr,'DEL'); }
        if (keyCode == 96) { window[fnName](curr,'DEL'); }
    }
    //--- VOLUME
    if (curr.hasClass('vol')) {
        //--- 1..9
        if (keyCode >= 49 && keyCode <= 57) {
            fnSetVol(activeBlockContainer, curr, keyCode - 48);
        }
        if (keyCode >= 97 && keyCode <= 105) {
            fnSetVol(activeBlockContainer, curr, keyCode - 96);
        }
        //--- A..F
        if (keyCode >= 65 && keyCode <= 70) {
            fnSetVol(activeBlockContainer, curr, keyCode - 65 + 10);
        }
        //--- del
        if (keyCode == 46) { fnSetVol(activeBlockContainer, curr,'DEL'); }
        //--- 0
        if (keyCode == 48) { fnSetVol(activeBlockContainer, curr,'DEL'); }
        if (keyCode == 96) { fnSetVol(activeBlockContainer, curr,'DEL'); }
    }

    //--- ENV FORM
    if (curr.hasClass('env-form')) {
        //--- 1..9
        if (keyCode >= 49 && keyCode <= 57) {
            fnSetEnvForm(activeBlockContainer, curr, keyCode - 48);
        }
        if (keyCode >= 97 && keyCode <= 105) {
            fnSetEnvForm(activeBlockContainer, curr, keyCode - 96);
        }
        //--- A..F
        if (keyCode >= 65 && keyCode <= 70) {
            fnSetEnvForm(activeBlockContainer, curr, keyCode - 65 + 10);
        }
        //--- del
        if (keyCode == 46) { fnSetEnvForm(activeBlockContainer, curr, 'DEL'); }
        //--- 0
        if (keyCode == 48) { fnSetEnvForm(activeBlockContainer, curr, 'DEL'); }
        if (keyCode == 96) { fnSetEnvForm(activeBlockContainer, curr, 'DEL'); }
    }
    //--- ENV PER
    if (curr.hasClass('env-per')) {
        //--- 0..9
        if (keyCode >= 48 && keyCode <= 57) {
            fnSetEnvPer(activeBlockContainer, curr, keyCode - 48);
        }
        if (keyCode >= 96 && keyCode <= 105) {
            fnSetEnvPer(activeBlockContainer, curr, keyCode - 96);
        }
        //--- A..F
        if (keyCode >= 65 && keyCode <= 70) {
            fnSetEnvPer(activeBlockContainer, curr, keyCode - 65 + 10);
        }
        //--- del
        if (keyCode == 46) {
            fnSetEnvPer(activeBlockContainer, curr, 'DEL');
        }
    }
    //--- NOISE PER
    if (curr.hasClass('noise')) {
        //--- 0..9
        if (keyCode >= 48 && keyCode <= 57) {
            fnSetNoise(activeBlockContainer, curr, keyCode - 48);
        }
        if (keyCode >= 96 && keyCode <= 105) {
            fnSetNoise(activeBlockContainer, curr, keyCode - 96);
        }
        //--- A..F
        if (settings.noisePerHexDec == 0) {
            if (keyCode >= 65 && keyCode <= 70) {
                fnSetNoise(activeBlockContainer, curr, keyCode - 65 + 10);
            }
        }
        //--- del
        if (keyCode == 46) { fnSetNoise(activeBlockContainer, curr, 'DEL'); }
    }
    //--- ORNAMENT
    if (curr.hasClass('orn-slide') || curr.hasClass('note-slide') || curr.hasClass('noise-slide') || curr.hasClass('env-slide')) {
        var fnSlideName;
        var slideHexDec;
        if (curr.hasClass('orn-slide')) {
            fnSlideName = 'fnSetOrnSld';
            slideHexDec = settings.ornSlideHexDec;
        } else if (curr.hasClass('note-slide')) {
            fnSlideName = 'fnSetToneSld';
            slideHexDec = settings.toneSlideHexDec;
        } else if (curr.hasClass('noise-slide')) {
            fnSlideName = 'fnSetNoiseSld';
            slideHexDec = settings.noiseSlideHexDec;
        } else if (curr.hasClass('env-slide')) {
            fnSlideName = 'fnSetEnvSld';
            slideHexDec = settings.envSlideHexDec;
        }
        var fnSlideSignName = fnSlideName + 'Sign';
        var fnSlideTypeName = fnSlideName + 'Type';
        //--- 0..9
        if (keyCode >= 48 && keyCode <= 57) {
            window[fnSlideName](activeBlockContainer, curr, keyCode - 48, slideHexDec);
        }
        if (keyCode >= 96 && keyCode <= 105) {
            window[fnSlideName](activeBlockContainer, curr, keyCode - 96, slideHexDec);
        }
        if (slideHexDec == 0) {
            //--- A..F
            if (keyCode >= 65 && keyCode <= 70) {
                window[fnSlideName](activeBlockContainer, curr, keyCode - 65 + 10, slideHexDec);
            }
        }
        //--- del
        if (keyCode == 46) { window[fnSlideName](activeBlockContainer, curr, 'DEL'); }
        //--- slide minus
        if (keyCode == 109) { window[fnSlideSignName](activeBlockContainer, curr, '-'); }
        //--- slide plus
        if (keyCode == 107) { window[fnSlideSignName](activeBlockContainer, curr, '+'); }
        //--- slide type simple
        //if (keyCode == ???) { window[fnSlideTypeName](activeBlockContainer, curr, '-'); }
        //--- slide type additive
        //if (keyCode == ???) { window[fnSlideTypeName](activeBlockContainer, curr, '+'); }
    }

    //--- disable F5
    if ((keyCode == 116) || (e.keyCode == 116)) {
        return false;
    }

    //console.log(keyCode);
});

$(document).on('DOMMouseScroll mousewheel', '.pattern-container', function(e){
	scrollFnName = e.originalEvent.wheelDelta > 0 ? 'fnScrollPatternUp' : 'fnScrollPatternDown';
	window[scrollFnName](1);
	return false;
});

$(document).on('keyup', function(e){
    var keyCode = e.keyCode || e.which;
    if (playCtrl.state == 1 && playCtrl.type == PLAY_TYPE_SAMPLE) {
        if (smplPlayCtrl[1].state != 0) {
            smplPlayCtrl[1].state = 2;
        }
        e.preventDefault();
        return false;
    }


    if ((playCtrl.state == 1 && playCtrl.type == PLAY_TYPE_PATT_POS)
        || (keyCode == 13 && playCtrl.state == 1 && playCtrl.type == PLAY_TYPE_PATT)
    ) {
        playCtrl.state = 0;
        fnStop();
        e.preventDefault();
        return false;
    }
});

/*--- TRACKER MOUSE CONTROL ---*/
$(document).on('mousedown', '.layout-tracker .pos span', function(e) {
    $('.block-container').removeClass('active');
    $('.layout-tracker').find('.pos span').removeClass('curr');
    $(this).parents('.block-container').addClass('active');
    $(this).addClass('curr');
});


/*--- SLIDER-TYPE CONTROL ---*/
$(document).on('mousedown', 'div.slide-type', function(e) {
    fnSetSliderType($(this));
});


$(document).on('click', '.patt-hdr-ctrl span', function() {
    $(this).toggleClass('active');
    var chip = $(this).attr('data-chip');
    var ch = $(this).attr('data-ch');
    var state = $(this).hasClass('active') ? 1 : 0;
    if ($(this).hasClass('mix-t')) {
        playCtrl.mix[chip].mixT[ch] = state;
    } else if ($(this).hasClass('mix-n')) {
        playCtrl.mix[chip].mixN[ch] = state;
    } else if ($(this).hasClass('mix-e')) {
        playCtrl.mix[chip].mixE[ch] = state;
    }
});

$(document).on('click', '.instruments div.selector-item', function() {
    currInstrument = parseInt($(this).attr('data-selector-id'));
});
$(document).on('click', '.samples div.selector-item', function() {
    sampleId = parseInt($(this).attr('data-selector-id'));
    setCurrSample(sampleId);
});
$(document).on('click', '.ornaments div.selector-item', function() {
    ornId = parseInt($(this).attr('data-selector-id'));
    setCurrOrn(ornId);
});



/*--- SAMPLER MOUSE CONTROL ---*/
$(document).on('mousedown', '.layout-sampler .pos span', function(e) {
    $('.block-container').removeClass('active');
    $('.layout-sampler').find('.pos span').removeClass('curr');
    $(this).parents('.block-container').addClass('active');
    $(this).addClass('curr');
});



/*--- CTRL ---*/
$(document).on('mousedown', 'a.ctrl-chip-select', function(e) {
    settings.chipType ^= 1;
    chipType = settings.chipType;
    $(this).html(settings.chipType == 0 ? 'YM' : 'AY');
});
$(document).on('mousedown', 'a.ctrl-chip-frq', function(e) {
    settings.chipFrqType ^= 1;
    chipFrq = settings.chipFrqType == 0 ? 1773400 : 1750000;
    $(this).html(settings.chipFrqType == 0 ? '1773400' : '1750000');
});

function fnResizePositions(Lnk, resizeBlockName, newSize, resizeFrom, fnRenderFunctionName) {
    showWaitbox();
    setTimeout(function() {
        var sizeDiff = newSize - Lnk[resizeBlockName];
        if (sizeDiff > 0) {
            for (var pos = Lnk.size + sizeDiff - 1; pos >= resizeFrom; pos--) {
                if (pos >= resizeFrom) {
                    Lnk.positions[pos] = fnNewSamplePos();
                }
                if (pos - sizeDiff >= resizeFrom && Lnk.positions[pos - sizeDiff] != undefined) {
                    Lnk.positions[pos] = clone(Lnk.positions[pos - sizeDiff]);
                }
            }
        } else {
            for (var pos = resizeFrom; pos < Lnk.size; pos++) {
                Lnk.positions[pos + sizeDiff] = clone(Lnk.positions[pos]);
            }
        }
        Lnk.size += sizeDiff;
        Lnk[resizeBlockName] = newSize;
        window[fnRenderFunctionName]();
        $.popup.close();
    }, 1);
}
$(document).on('change', '#sampler-size-atk', function() {
    fnResizePositions(
        module.samples[currSample],
        'sizeAttack',
        parseInt($(this).val()),
        module.samples[currSample].sizeAttack,
        'fnRenderEditSample'
    );
});
$(document).on('change', '#sampler-size-sus', function() {
    fnResizePositions(
        module.samples[currSample],
        'sizeSuspend',
        parseInt($(this).val()),
        module.samples[currSample].sizeAttack
            + module.samples[currSample].sizeSuspend,
        'fnRenderEditSample'
    );
});
$(document).on('change', '#sampler-size-rel', function() {
    fnResizePositions(
        module.samples[currSample],
        'sizeRelease',
        parseInt($(this).val()),
        module.samples[currSample].sizeAttack
            + module.samples[currSample].sizeSuspend
            + module.samples[currSample].sizeRelease,
        'fnRenderEditSample'
    );
});
$(document).on('change', '#sampler-size-lp2', function() {
    fnResizePositions(
        module.samples[currSample],
        'sizeLoop2',
        parseInt($(this).val()),
        module.samples[currSample].sizeAttack
            + module.samples[currSample].sizeSuspend
            + module.samples[currSample].sizeRelease
            + module.samples[currSample].sizeLoop2,
        'fnRenderEditSample'
    );
});

$(document).on('change', '#sampler-orn-size-atk', function() {
    fnResizePositions(
        module.ornaments[currOrnament],
        'sizeAttack',
        parseInt($(this).val()),
        module.ornaments[currOrnament].sizeAttack,
        'fnRenderEditOrn'
    );
});
$(document).on('change', '#sampler-orn-size-sus', function() {
    var Lnk = module.ornaments[currOrnament];
    fnResizePositions(
        Lnk,
        'sizeSuspend',
        parseInt($(this).val()),
        module.ornaments[currOrnament].sizeAttack
            + module.ornaments[currOrnament].sizeSuspend,
        'fnRenderEditOrn'
    );
});
$(document).on('change', '#sampler-orn-size-rel', function() {
    var Lnk = module.ornaments[currOrnament];
    fnResizePositions(
        Lnk,
        'sizeRelease',
        parseInt($(this).val()),
        module.ornaments[currOrnament].sizeAttack
            + module.ornaments[currOrnament].sizeSuspend
            + module.ornaments[currOrnament].sizeRelease,
        'fnRenderEditOrn'
    );
});
$(document).on('change', '#sampler-orn-size-lp2', function() {
    var Lnk = module.ornaments[currOrnament];
    fnResizePositions(
        Lnk,
        'sizeLoop2',
        parseInt($(this).val()),
        module.ornaments[currOrnament].sizeAttack
            + module.ornaments[currOrnament].sizeSuspend
            + module.ornaments[currOrnament].sizeRelease
            + module.ornaments[currOrnament].sizeLoop2,
        'fnRenderEditOrn'
    );
});

$(document).on('click', '.ctrl-play-beg', function() {
	playCtrl.type = PLAY_TYPE_TRACK;
    playCtrl.posCounter = 0;
    currPattPos = 0;
	currTrackPos = 0;
	currPattern = module.track[0];
	fnRenderTrack();
	fnRenderPattern();
    divPattern.css('transition', '0ms');
    divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
    fnPlay(PLAY_TYPE_TRACK);
});

$(document).on('click', '.ctrl-play-patt-beg', function() {
    playCtrl.type = PLAY_TYPE_PATT;
    playCtrl.posCounter = 0;
    currPattPos = 0;
    divPattern.css('transition', '0ms');
    divPattern.css('transform', 'translate3d(0px,' + (fnPattScrollValue())  + 'px,0px)');
    fnPlay(PLAY_TYPE_PATT);
});
$(document).on('click', '.ctrl-stop', function() {
    fnStop();
});

$(document).on('click', '#ctrl-module-new', function() {
    fnStop();
    setTimeout(function(){
        module = fnNewModule();
		currTrackPos = 0;
        currPattern = module.track[0];
        currPattPos = 0;
        fnRenderTracker();
        fnRenderISOEditor();
    }, 1);
});
$(document).on('click', '#ctrl-module-save', function() { 
	moduleSaveToLocalStorage();
    var saveDialog = document.getElementById('file-save-dialog');
    var filename = saveDialog.getAttribute('data-filename');
    saveDialog.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(module, null, "\t")));
    saveDialog.setAttribute('type', '.aym');
    saveDialog.setAttribute('download', filename=='' ? 'y-studio-new-module.aym' : '');
    saveDialog.click();
});
function onFilesSelect(e) {
    var openDialog = document.getElementById('file-open-dialog');
    var file = e.target.files[0];
    if (file != undefined) {
        $.popup({'content':'<div class="waitbox"></div>'});
        fr = new FileReader();
        fr.readAsText(file);
        fr.onload = function (e) {
            module = fnNewModule();
            module = deepmerge(module, JSON.parse(e.target.result));
			currTrackPos = 0;
            currPattern = module.track[0];
            currPattPos = 0;
            fnRenderTracker();
            fnRenderISOEditor();
            $.popup.close();
            openDialog.value = '';
        };
    }
}
$(document).on('click', '#ctrl-module-open', function() {
    var openDialog = document.getElementById('file-open-dialog');
    openDialog.accept = '.aym';
    openDialog.click();
});
if (window.File && window.FileReader && window.FileList && window.Blob) {
    onload = function () {
        document.querySelector('input#file-open-dialog').addEventListener('change', onFilesSelect, false);
    }
}

$(document).on('click', '#ctrl-edit-clear-patt', function() {
    fnStop();
    setTimeout(function(){
        module.patterns[currPattern] = fnNewPattern();
        currPattPos = 0;
        fnRenderTrack();
        fnRenderPattern();
    }, 1);
});


$(document).on('click', 'div.track-pos', function() {
	if (!$(this).hasClass('active')) {
		$('.track-pos').removeClass('active');
		$(this).addClass('active');
		fnStop();
		currTrackPos = parseInt($(this).attr('id').split('-')[2]);
		currPattern = parseInt($(this).find('input.track-pos-id').val());
		currPattPos = 0;
		fnRenderPattern();
	}
});


function changeTrackPatternId(posDiv, patternId) {
	patternId = isNaN(patternId) ? 0 : patternId;
	patternId = patternId > 255 ? 255 : patternId;
	patternId = patternId < 0 ? 0 : patternId;
	posDiv.find('input.track-pos-id').val(patternId);
	if (module.patterns[patternId] == undefined) {
		module.patterns[patternId] = fnNewPattern();
	}
	posDiv.find('input.track-pos-name').val(module.patterns[patternId].name);
	var pos = parseInt(posDiv.attr('id').split('-')[2]);
	module.track[pos] = patternId;
	currPattern = patternId;
	currPattPos = 0;
	fnRenderPattern();
}

$(document).on('keydown', 'input.track-pos-id', function(e) {
	var keyCode = e.keyCode || e.which;
	var posDiv = $(this).parents('.track-pos').first();
	var patternId = parseInt($(this).val());
	if (keyCode == 107) {
		changeTrackPatternId(posDiv, patternId + 1);
		return false;
	} else if (keyCode == 109) {
		changeTrackPatternId(posDiv, patternId - 1);
		return false;
	}
});

$(document).on('keyup', 'input.track-pos-id', function(e) {
	var posDiv = $(this).parents('.track-pos').first();
	var pos = parseInt(posDiv.attr('id').split('-')[2]);
	var patternId = parseInt($(this).val());
	changeTrackPatternId(posDiv, patternId);
});


$(document).on('keyup', 'input.track-pos-name', function(e) {
	var trackPosName = $(this).val();
	var posDiv = $(this).parents('.track-pos').first();	
	var pos = posDiv.attr('id').split('-')[2];
	var patternId = posDiv.find('input.track-pos-id').val();
	$('.track-pos').each(function(tmpPos) {
		if (pos != tmpPos && $(this).find('input.track-pos-id').val() == patternId) {
			$(this).find('input.track-pos-name').val(trackPosName);
		}
	});
	module.patterns[patternId].name = trackPosName;
	
});


$(document).on('click', '.track-ctrl__add', function() {
	module.track.push(0);
	fnRenderTrack();
	fnRenderPattern();
});

$(document).on('click', '.track-ctrl__del', function() {
	var posDiv = $('.track-pos.active');	
	var pos = posDiv.attr('id').split('-')[2];
	module.track.splice(pos, 1);
	if (currTrackPos >= module.track.length) {
		currTrackPos--;
	}
	currPattPos = 0;
	currPattern = module.track[currTrackPos];
	fnRenderTrack();
	fnRenderPattern();
	
});

$(document).on('click', '.track-ctrl__ins', function() {
	var tmpTrack = [];
	var posDiv = $('.track-pos.active');	
	var pos = posDiv.attr('id').split('-')[2];
	$.each(module.track, function(tmpPos, patternId) {
		if (pos == tmpPos) {
			tmpTrack.push(0);
		}
		tmpTrack.push(patternId);
	});
	module.track = tmpTrack;
	currPattPos = 0;
	currPattern = module.track[pos];
	fnRenderTrack();
	fnRenderPattern();
});




layouts = {};
layouts.pattern = [
    { x: 38, size: 8, name: 'EnvPer', subId: 0 },
    { x: 46, size: 8, name: 'EnvPer', subId: 1 },
    { x: 54, size: 8, name: 'EnvPer', subId: 2 },
    { x: 62, size: 8, name: 'EnvPer', subId: 3 },
    { x: 0, size: 8, name: 'EnvNote', subId: 0 },
    { x: 0, size: 8, name: 'EnvForm', subId: 0 },
];



//--------------------- pattern canvas events
$(document).on('click', '.c-pattern', function(e){
    var pos = Math.floor(e.offsetY / settings.sizes.lineHeight);
    var id = false;
    var i = 0;
    while (i < layouts.pattern.length && id === false) {
        if (e.offsetX >= layouts.pattern[i].x && e.offsetX < layouts.pattern[i].x + layouts.pattern[i].size) {
            id = layouts.pattern[i].id;
        }
        i++;
    }
    console.log(e.offsetX, e.offsetY, pos, id, id!==false ? layouts.pattern[id] : '---');
});


