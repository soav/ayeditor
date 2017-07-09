/*
    Z80         chip        tpf
ZX Spectrum 48K
    3500000     1750000     69888 @ 50.08012820512821
ZX Spectrum 128K / +2 / +2A / +3
    3546900     1773450     70908 @ 50.02115417160264
    3546895     1773447.5   70908 @ 50.0210836576973
PENTAGON
    3500000     1750000     71680 @ 48.828125

AudioContext nodes:
    scriptNode(A,B,C * chipQty) -> gainNode -> splitterNode(A,B,C * chipQty) ->
                                                              A --------------------> mergerNode(stereo) |
                                                         ->   B -> gainNodeB(0.75) -> mergerNode(stereo) |-> AudioContext.destination
                                                              C --------------------> mergerNode(stereo) |
*/

var test = true;

function aymPlayer () {
    this.initialize();
}

aymPlayer.prototype.initialize = function() {
    this.chipQty = 1;           // 1 or 2
    this.chipType = 0;          // 0 - YM,  1 - AY - use only for volume table
    this.chipFrq = 1773400;//1536000
    this.chipChBVol = 0.75;
    this.chipFrqDetune = this.chipFrq / 1773400;
    this.chipFrameFrq = this.chipFrqDetune * 70908;    // 70908 - Original ZX, 71680 - Pentagon
    this.chipVolTbl = [
        [
            0.0, 0.0,
            0.00465400167849, 0.00772106507973,
            0.0109559777218, 0.0139620050355,
            0.0169985503929, 0.0200198367285,
            0.024368657969, 0.029694056611,
            0.0350652323186, 0.0403906309606,
            0.0485389486534, 0.0583352407111,
            0.0680552376593, 0.0777752346075,
            0.0925154497597, 0.111085679408,
            0.129747463188, 0.148485542077,
            0.17666895552, 0.211551079576,
            0.246387426566, 0.281101701381,
            0.333730067903, 0.400427252613,
            0.467383840696, 0.53443198291,
            0.635172045472, 0.75800717174,
            0.879926756695, 1.0
        ],
        [
            0.0, 0.0,
            0.00999465934234, 0.00999465934234,
            0.0144502937362, 0.0144502937362,
            0.0210574502174, 0.0210574502174,
            0.0307011520562, 0.0307011520562,
            0.0455481803616, 0.0455481803616,
            0.0644998855573, 0.0644998855573,
            0.107362478065, 0.107362478065,
            0.126588845655, 0.126588845655,
            0.20498970016, 0.20498970016,
            0.292210269322, 0.292210269322,
            0.372838941024, 0.372838941024,
            0.492530708782, 0.492530708782,
            0.635324635691, 0.635324635691,
            0.805584802014, 0.805584802014,
            1.0, 1.0
        ],
    ];
    this.chipEnvInitState = [
        15,15,15,15,    //0-3
        0,0,0,0,        //4-7
        15,15,15,15,    //8-11
        0,0,0,0,        //12-15
    ];
    this.chipsData = [];
    this.chipIsPlay = 0;
    for (var chip = 0; chip < this.chipQty; chip++) {
        this.chipsData[chip] = {
            //regs values
            tonePer: [0, 0, 0],
            vol: [0, 0, 0],
            mixTone: [0, 0, 0],
            mixNoise: [0, 0, 0],
            mixEnv: [0, 0, 0],
            envPer: 0,
            envForm: 0,
            noisePer: 0,
            //counters
            tCnt: [0, 0, 0],
            nCnt: 0,
            envCnt: 0,
            //state
            tState: [0, 0, 0],
            shiftreg: 1,
            envState: 15,
            envGenFaze: 0,
            nState: 0,
            //emul counter
            emulCnt: 0,
            frameCnt: 0,
        };
    }

    this.emulQuality = 1;
    this.bufferSize = 2048;
    this.initAudioContext();
    this.stepsPerBuffTN = this.bufferSize * this.chipFrq / this.context.sampleRate / 8 * this.emulQuality;
    this.stepsOutTN = this.stepsPerBuffTN / this.bufferSize;

    //console.log(this.stepsPerBuffTN, this.stepsOutTN);
    
    this.chipBuffCnt = 0;
    this.chipBuffDecCnt = 0;
    this.chipBuffSize = Math.ceil(this.stepsPerBuffTN * 8);
    this.chipBuff = [];
    for (var chip = 0; chip < this.chipQty; chip++) {
        this.chipBuff[chip] = [];
        for (ch = 0; ch < 3; ch++) {
            this.chipBuff[chip][ch] = [];
            for (var i = 0; i < this.chipBuffSize ; i++) {
                this.chipBuff[chip][ch][i] = 0;            
            }
        }
    }
    
    this.canvasFrq = false;
    this.canvasFrqCtx = false;
}

aymPlayer.prototype.initAudioContext = function() {
    var _pl = this;
    var AudioContextLnk = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContextLnk();
    this.scriptNode = this.context.createScriptProcessor(this.bufferSize, this.chipQty * 3, this.chipQty * 3);
    this.scriptNode.onaudioprocess = function(e) {
        _pl.renderBuff(_pl, e);
    };
    this.gainNode = this.context.createGain(); //global tracker volume
    this.gainNode.gain.value = 1;
    this.splitterNode = this.context.createChannelSplitter(this.chipQty * 3); //for mix ABC to stereo
    this.mergerNode = this.context.createChannelMerger(2);
    this.analyserNodeFrq = this.context.createAnalyser();
    this.analyserNodeFrq.smoothingTimeConstant = 0.3;
    this.analyserNodeFrq.fftSize = 1024;
    this.analyserArrayFrq = new Uint8Array(this.analyserNodeFrq.frequencyBinCount);
    
    //console.log(this.analyserNodeFrq);
    
    this.analyserArrayForm = new Uint8Array(this.analyserNodeFrq.frequencyBinCount);
    this.analyserScriptNode = this.context.createScriptProcessor(2048);
    this.analyserScriptNode.onaudioprocess = function(e) {
        _pl.analyserNodeFrq.getByteFrequencyData(_pl.analyserArrayFrq);
        _pl.analyserNodeFrq.getByteTimeDomainData(_pl.analyserArrayForm);
    }

    this.gainNodeB = [];
    for (var chip = 0; chip < this.chipQty; chip++) {
        var chA = chip * this.chipQty + 0;
        var chB = chip * this.chipQty + 1;
        var chC = chip * this.chipQty + 2;
            //-- ch b
        this.gainNodeB[chip] = this.context.createGain();
        this.gainNodeB[chip].gain.value = this.chipChBVol;
        this.splitterNode.connect(this.gainNodeB[chip], chB);
        this.gainNodeB[chip].connect(this.mergerNode, 0, 0);
        this.gainNodeB[chip].connect(this.mergerNode, 0, 1);
        //-- ch a
        this.splitterNode.connect(this.mergerNode, chA, 0);
        //-- ch c
        this.splitterNode.connect(this.mergerNode, chC, 1);
    }
    this.scriptNode.connect(this.gainNode);
    this.gainNode.connect(this.splitterNode);
    this.mergerNode.connect(this.analyserNodeFrq);
    this.analyserNodeFrq.connect(this.analyserScriptNode);
    this.analyserScriptNode.connect(this.context.destination);
    this.mergerNode.connect(this.context.destination);
}

aymPlayer.prototype.renderBuff = function(pl, e) {
    var output = [];
    for (var chip = 0; chip < pl.chipQty; chip++) {
        output[chip] = [];
        for (var ch = 0; ch < 3; ch++) {
            output[chip][ch] = e.outputBuffer.getChannelData(ch + chip * 3);
        }
    }
    //-- ay emulator on playback 
    if (pl.chipIsPlay == 1) {
        for (var chip = 0; chip < pl.chipQty; chip++) {
            pl.chipsData[chip].emulCnt = pl.chipsData[chip].emulCnt + pl.stepsPerBuffTN;
            while (pl.chipsData[chip].emulCnt < pl.stepsOutTN * e.outputBuffer.length) {
                pl.chipsData[chip].emulCnt += 1;
            }
            while (pl.chipsData[chip].emulCnt >= 0) {
                pl.chipsData[chip].emulCnt -= 1;
                if (pl.chipsData[chip].frameCnt >= pl.chipFrameFrq) {
                    pl.chipsData[chip].frameCnt -= pl.chipFrameFrq;
                    // get new regs (only for 48000/2048/50)
                    var newRegs = fnPlayRegProvider();
                    for (ch = 0; ch < 3; ch++) {
                        pl.chipsData[chip].tonePer[ch] = newRegs[chip].tonePer[ch] & 0x0FFF;
                        pl.chipsData[chip].vol[ch] = newRegs[chip].vol[ch] & 0x0F;
                        pl.chipsData[chip].mixTone[ch] = newRegs[chip].mixTone[ch];
                        pl.chipsData[chip].mixNoise[ch] = newRegs[chip].mixNoise[ch];
                        pl.chipsData[chip].mixEnv[ch] = newRegs[chip].mixEnv[ch];
                    }
                    if (pl.chipsData[chip].envForm != newRegs[chip].envForm) {
                        pl.chipsData[chip].envGenFaze = 0;
                        pl.chipsData[chip].envForm = newRegs[chip].envForm & 0x0F;
                        pl.chipsData[chip].envState = pl.chipEnvInitState[pl.chipsData[chip].envForm];
                    }
                    pl.chipsData[chip].envPer = newRegs[chip].envPer & 0xFFFF;
                    pl.chipsData[chip].envForm = newRegs[chip].envForm & 0x0F;
                    pl.chipsData[chip].noisePer = newRegs[chip].noisePer & 0x1F;
                }
                // frame counter
                pl.chipsData[chip].frameCnt += 16 / pl.emulQuality;
                
                // envelope process
                pl.chipsData[chip].envCnt++;
                if (pl.chipsData[chip].envCnt >= pl.chipsData[chip].envPer * pl.emulQuality) {
                    pl.chipsData[chip].envCnt = 0;
                    //--------------------------  \|\|\|\|
                    if (pl.chipsData[chip].envForm == 8) {
                        pl.chipsData[chip].envState--;
                        if (pl.chipsData[chip].envState < 0 ) {
                            pl.chipsData[chip].envState = 31;
                        }
                    //--------------------------  /|/|/|/|
                    } else if (pl.chipsData[chip].envForm == 12) {
                        pl.chipsData[chip].envState++;
                        pl.chipsData[chip].envState = pl.chipsData[chip].envState & 31;
                    //--------------------------  \/\/\/\/
                    } else if (pl.chipsData[chip].envForm == 10) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState--;
                            if (pl.chipsData[chip].envState < 0) {
                                pl.chipsData[chip].envState = 0
                                pl.chipsData[chip].envGenFaze ^= 1;
                            }
                        } else {
                            pl.chipsData[chip].envState++;
                            if (pl.chipsData[chip].envState > 31) {
                                pl.chipsData[chip].envState = 31
                                pl.chipsData[chip].envGenFaze ^= 1;
                            }
                        }
                    //--------------------------  /\/\/\/
                    } else if (pl.chipsData[chip].envForm == 14) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState++;
                            if (pl.chipsData[chip].envState > 31) {
                                pl.chipsData[chip].envState = 31
                                pl.chipsData[chip].envGenFaze = 1;
                            }
                        } else {
                            pl.chipsData[chip].envState--;
                            if (pl.chipsData[chip].envState < 0) {
                                pl.chipsData[chip].envState = 0
                                pl.chipsData[chip].envGenFaze = 0;
                            }
                        }
                    //--------------------------  \____   0,1,2,3,9
                    } else if (pl.chipsData[chip].envForm <= 3 || pl.chipsData[chip].envForm == 9) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState--;
                            if (pl.chipsData[chip].envState < 0) {
                                pl.chipsData[chip].envState = 0;
                                pl.chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  /|____   4,5,6,7,15
                    } else if ((pl.chipsData[chip].envForm >= 4 && pl.chipsData[chip].envForm <= 7) || pl.chipsData[chip].envForm == 31) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState++;
                            if (pl.chipsData[chip].envState > 31) {
                                pl.chipsData[chip].envState = 0;
                                pl.chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  \|"""" 11
                    } else if (pl.chipsData[chip].envForm == 11) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState--;
                            if (pl.chipsData[chip].envState < 0) {
                                pl.chipsData[chip].envState = 31;
                                pl.chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  /"""" 13
                    } else if (pl.chipsData[chip].envForm == 13) {
                        if (pl.chipsData[chip].envGenFaze == 0) {
                            pl.chipsData[chip].envState++;
                            if (pl.chipsData[chip].envState > 31) {
                                pl.chipsData[chip].envState = 31;
                                pl.chipsData[chip].envGenFaze = 1;
                            }
                        }
                    }
                }

                // noise
                pl.chipsData[chip].nCnt++;
                if (pl.chipsData[chip].nCnt >= pl.chipsData[chip].noisePer * pl.emulQuality) {
                    pl.chipsData[chip].nCnt = 0;
                    // (c)http://www.vgmpf.com/Wiki/images/7/7c/AY8930_-_Manual.pdf
                    // bit0 xor bit2, roll right, xored value to bit16, bit1 to result
                    // var bit0x2 = (chipsData[chip].shiftreg & 1) ^ ((chipsData[chip].shiftreg >> 3) & 1);
                    // chipsData[chip].shiftreg = (chipsData[chip].shiftreg >>> 1) + (bit0x2 << 16);
                    // chipsData[chip].nState = chipsData[chip].shiftreg & 1;
                    
                    // (c)ayumi
                    // bit0 xor bit3, roll right, xored value to bit16, bit1 to result
                    var bit0x3 = (pl.chipsData[chip].shiftreg & 1) ^ ((pl.chipsData[chip].shiftreg >> 3) & 1);
                    pl.chipsData[chip].shiftreg = (pl.chipsData[chip].shiftreg >>> 1) + (bit0x3 << 16);
                    pl.chipsData[chip].nState = pl.chipsData[chip].shiftreg & 1;
                }
                // tones a,b,c & mixing
                for (ch = 0; ch < 3; ch++) {
                    // tone a
                    pl.chipsData[chip].tCnt[ch]++;
                    if (pl.chipsData[chip].tCnt[ch] >= pl.chipsData[chip].tonePer[ch] * pl.emulQuality) {
                        pl.chipsData[chip].tCnt[ch] = 0;
                        pl.chipsData[chip].tState[ch] ^= 1;
                    }
                    // mix
                    var out = pl.chipsData[chip].mixTone[ch] == 0 ? 1 : pl.chipsData[chip].tState[ch];
                    out &= pl.chipsData[chip].mixNoise[ch] == 0 ? 1 : pl.chipsData[chip].nState;
                    out *= pl.chipsData[chip].mixEnv[ch] == 0 ? pl.chipVolTbl[pl.chipType][pl.chipsData[chip].vol[ch] * 2 + 1]
                        : pl.chipVolTbl[pl.chipType][pl.chipsData[chip].envState];
                    //out to buff
                    pl.chipBuff[chip][ch][pl.chipBuffCnt] = out;
                }
                pl.chipBuffCnt++;
                if (pl.chipBuffCnt >= pl.chipBuffSize) {
                    pl.chipBuffCnt = 0;
                }
            }
        }
        //-- resample & render (first time just float step)
        for (var i = 0; i < e.outputBuffer.length; i++) {
            var left = pl.chipBuffDecCnt;
            var right = pl.chipBuffDecCnt + pl.stepsOutTN;
            var size = Math.floor(right) - Math.ceil(left);
            var idx = Math.ceil(left);
            var div = size;
            div += left != Math.floor(left) ? 1 : 0;
            div += right != Math.floor(right) ? 1 : 0;
            for (var chip = 0; chip < pl.chipQty; chip++) {
                for (var ch = 0; ch < 3; ch++) {
                    var out = 0;
                    for (var j = 0; j < size; j++) {
                        var idxDec = idx + j;
                        if (idxDec < 0) {
                            idxDec += pl.chipBuffSize;
                        } else if (idxDec >= pl.chipBuffSize) {
                            idxDec -= pl.chipBuffSize;
                        }
                        
                        out += pl.chipBuff[chip][ch][idxDec];
                    }
                    if (left != Math.floor(left)) {
                        idxDec = Math.floor(left);
                        out += pl.chipBuff[chip][ch][idxDec] * (1 - (left - Math.floor(left)));
                    }
                    if (right != Math.floor(right)) {
                        out += pl.chipBuff[chip][ch][idxDec] * (1 - (right - Math.floor(right)));
                    }
                    output[chip][ch][i] = (out / div);
                    output[chip][ch][i] = pl.chipBuff[chip][ch][idx];
                }
            }
            pl.chipBuffDecCnt += pl.stepsOutTN;
            if (pl.chipBuffDecCnt >= pl.chipBuffSize) {
                pl.chipBuffDecCnt -= pl.chipBuffSize;
            }
        }
    } else {
        //--- silence
        for (var i = 0; i < e.outputBuffer.length; i++) {
            for (var chip = 0; chip < pl.chipQty; chip++) {
                for (var ch = 0; ch < 3; ch++) {
                    output[chip][ch][i] = 0;
                }
            }
        }
    }
}
aymPlayer.prototype.getInfo = function() {
    return {
        chipQty: this.chipQty,
        sampleRate: this.context.sampleRate,
        bufferSize: this.bufferSize,
    };
}

aymPlayer.prototype.chipReset = function() {
    this.chipIsPlay = 0;
    for (var chip = 0; chip < this.chipQty; chip++) {
        //regs
        for (ch = 0; ch < 3; ch++) {
            this.chipsData[chip].tonePer[ch] = 0;
            this.chipsData[chip].vol[ch] = 0;
            this.chipsData[chip].mixTone[ch] = 0;
            this.chipsData[chip].mixNoise[ch] = 0;
            this.chipsData[chip].mixEnv[ch] = 0;
        }
        this.chipsData[chip].envPer = 0;
        this.chipsData[chip].envForm = -1;
        this.chipsData[chip].noisePer = 0;
        //counters
        for (ch = 0; ch < 3; ch++) {
            this.chipsData[chip].tCnt[ch] = 0;
        }
        this.chipsData[chip].nCnt = 0;
        this.chipsData[chip].envCnt = 0;
        //state
        for (ch = 0; ch < 3; ch++) {
            this.chipsData[chip].tState[ch] = 0;
        }
        this.chipsData[chip].shiftreg = 1;
        this.chipsData[chip].envState = this.chipEnvInitState[0];
        this.chipsData[chip].envGenFaze = 0;
        this.chipsData[chip].nState = 0;
        //emul counter
        this.chipsData[chip].emulCnt = 0;
        //frame counter
        this.chipsData[chip].frameCnt = this.chipFrameFrq;
        //clear buffers
        this.chipBuffCnt = 0;
        this.chipBuffDecCnt = 0;
        for (ch = 0; ch < 3; ch++) {
            for (var i = 0; i < this.chipBuffSize ; i++) {
                this.chipBuff[chip][ch][i] = 0;
            }
        }
    }
}

aymPlayer.prototype.play = function() {
    this.chipReset();
    this.chipIsPlay = 1;
}
aymPlayer.prototype.stop = function() {
    this.chipReset();
}

aymPlayer.prototype.drawAnalyser = function(pl) {
    if (this.canvasFrq) {
        this.canvasFrqCtx.clearRect(0, 0, 300, 160);
        var bars = this.analyserArrayFrq.length;
        for (var i = 0; i < bars; i++) {
            bar_width = 1;
            bar_space = 1;
            bar_x = i * (bar_width + bar_space);
            bar_height = -(this.analyserArrayFrq[i] / 256 * 160);
            this.canvasFrqCtx.fillRect(bar_x, 160, bar_width, bar_height);
        }
        this.canvasFormCtx.clearRect(0, 0, this.canvasForm.width, this.canvasForm.height);
        var bars = this.analyserArrayForm.length;
        for (var i = 0; i < bars; i++) {
            bar_width = 1;
            bar_space = 0;
            bar_x = i * (bar_width + bar_space);
            bar_height = this.analyserArrayForm[i] / 256 * this.canvasForm.height;
            this.canvasFormCtx.fillRect(bar_x, this.canvasForm.height, bar_width, 2*(this.canvasForm.height/2 - bar_height));
        }
    }
}

aymPlayer.prototype.initAnalyser = function() {
	return false;
    this.canvasFrq = document.getElementById("analyser-frq");
    this.canvasForm = document.getElementById("analyser-form");
    this.canvasFrqCtx = this.canvasFrq.getContext("2d");
    this.canvasFormCtx = this.canvasForm.getContext("2d");
    this.canvasFrqGradient = this.canvasFrqCtx.createLinearGradient(0,0,0,300);
    this.canvasFrqGradient.addColorStop(1,'#00ff00');
    this.canvasFrqGradient.addColorStop(0.5,'#00ff00');
    this.canvasFrqGradient.addColorStop(0.1,'#ffff00');
    this.canvasFrqGradient.addColorStop(0,'#ff0000');
    this.canvasFrqCtx.fillStyle = this.canvasFrqGradient;
    this.canvasFormCtx.fillStyle = this.canvasFrqGradient;
    this.drawAnalyser();
}


var aymPlayer = new aymPlayer();
var aymPlayerInfo = aymPlayer.getInfo();
//console.log(aymPlayerInfo);
$(document).ready(function(){
    aymPlayer.initAnalyser();
});