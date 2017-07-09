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
var ticksQty = 0;

var chipQty = 1;
var chipType = 0;       // 0 - YM,  1 - AY - use only for volume table
var chipFrq = 1773400;  // 1773400 - Original ZX, 1750000 - Pentagon (3546895/2=1773447.5)
var chipChBVol = 0.75;  //???
var chipFrameFrq = 70908; // 70908 - Original ZX, 71680 - Pentagon
var frameFrq = 50;      // 50 - Original ZX, 48.828 - Pentagon

var chipFrameCounter = 0; //calc fps for next reg data

var chipVolTbl = [
    [
        0.000000, 0.000000, 0.003784, 0.006867, 0.010224, 0.012604, 0.015412, 0.018906, 
        0.023682, 0.029282, 0.035309, 0.040070, 0.047776, 0.057649, 0.067247, 0.076768, 
        0.091066, 0.109270, 0.128405, 0.146822, 0.174273, 0.208881, 0.243488, 0.278935, 
        0.332021, 0.398993, 0.465751, 0.532219, 0.632242, 0.753857, 0.877272, 1.000000,
    ],
    [
        0.000000, 0.000000, 0.006867, 0.006867, 0.012604, 0.012604, 0.018906, 0.018906, 
        0.029282, 0.029282, 0.040070, 0.040070, 0.057649, 0.057649, 0.076768, 0.076768, 
        0.109270, 0.109270, 0.146822, 0.146822, 0.208881, 0.208881, 0.278935, 0.278935, 
        0.398993, 0.398993, 0.532219, 0.532219, 0.753857, 0.753857, 1.000000, 1.000000,
    ],
    [
        0.000000, 0.000000, 0.012757, 0.012757, 0.018494, 0.018494, 0.027054, 0.027054, 
        0.039963, 0.039963, 0.059129, 0.059129, 0.082353, 0.082353, 0.134630, 0.134630, 
        0.158572, 0.158572, 0.254917, 0.254917, 0.356130, 0.356130, 0.446967, 0.446967, 
        0.564111, 0.564111, 0.708339, 0.708339, 0.842222, 0.842222, 1.000000, 1.000000,
    ]
 ];

var AudioContextLnk = window.AudioContext || window.webkitAudioContext;

var bufferSize = 2048; //scriptNode process buffer size 256/512/1024...16384
var context = new AudioContextLnk();
var stepsPerBuffTN = ((chipFrq / context.sampleRate) * bufferSize) / 8;
var stepsOutTN = stepsPerBuffTN/bufferSize;

var frameFrqTick = 0;
var frameFrqTickMax = (context.sampleRate / frameFrq) / 2;

var chipEmulOverStep = chipFrq / 8 / context.sampleRate;

var chipIsPlay = 0;
var chipsChannelsBuff = [];
var chipEnvInitState = [
    15,15,15,15,    //0-3
    0,0,0,0,    //4-7
    15,15,15,15,    //8-11
    0,0,0,0,    //12-15
];
var chipsData = [];
for (var chip = 0; chip < chipQty; chip++) {
    chipsData[chip] = {
        //regs values
        tonePer: [0, 0, 0],
        vol: [0, 0, 0],
        mixTone: [0, 0, 0],
        mixNoise: [0, 0, 0],
        mixEnv: [0, 0, 0],
        envPer: 0,
        envForm: -1,
        noisePer: 0,
        //counters
        tCnt: [0, 0, 0],
        nCnt: 0,
        envCnt: 0,
        //state
        tState: [0, 0, 0],
        shiftreg: 1, //65535???
        envState: chipEnvInitState[0],
        envGenFaze: 0,
        nState: 0,
        //emul counter
        emulCnt: 0,
        frameCnt: 0,
    };
    chipsChannelsBuff[chip] = [];
    for (ch = 0; ch < 3; ch++) {
        chipsChannelsBuff[chip][ch] = [];
        for (var i = 0; i < stepsPerBuffTN + chipEmulOverStep ; i++) {
            chipsChannelsBuff[chip][ch][i] = 0;            
        }
    }
}

function chipReset() {
    chipIsPlay = 0;
    chipFrameCounter = 0;
    for (var chip = 0; chip < chipQty; chip++) {
        //regs
        for (ch = 0; ch < 3; ch++) {
            chipsData[chip].tonePer[ch] = 0;
            chipsData[chip].vol[ch] = 0;
            chipsData[chip].mixTone[ch] = 0;
            chipsData[chip].mixNoise[ch] = 0;
            chipsData[chip].mixEnv[ch] = 0;
        }
        chipsData[chip].envPer = 0;
        chipsData[chip].envForm = -1;
        chipsData[chip].noisePer = 0;
        //counters
        for (ch = 0; ch < 3; ch++) {
            chipsData[chip].tCnt[ch] = 0;
        }
        chipsData[chip].nCnt = 0;
        chipsData[chip].envCnt = 0;
        //state
        for (ch = 0; ch < 3; ch++) {
            chipsData[chip].tState[ch] = 0;
        }
        chipsData[chip].shiftreg = 65535;
        chipsData[chip].envState = chipEnvInitState[0];
        chipsData[chip].envGenFaze = 0;
        chipsData[chip].nState = 0;
        //emul counter
        chipsData[chip].emulCnt = 0;
        //frame counter
        chipsData[chip].frameCnt = chipFrameFrq;
        
        //clear buffers
        for (ch = 0; ch < 3; ch++) {
            for (var i = 0; i < stepsPerBuffTN + chipEmulOverStep ; i++) {
                chipsChannelsBuff[chip][ch][i] = 0;
            }
        }
    }
}

//--- sound processing
var scriptNode = context.createScriptProcessor(bufferSize, chipQty*3, chipQty*3);
scriptNode.onaudioprocess = function (e) {
    var output = [];
    for (var chip = 0; chip < chipQty; chip++) {
        output[chip] = [];
        for (var ch = 0; ch < 3; ch++) {
            output[chip][ch] = e.outputBuffer.getChannelData(ch + chip*3);
        }
    }
    //-- ay emulator on playback 
    if (chipIsPlay) {
        for (var chip = 0; chip < chipQty; chip++) {
            var step = 0;
            chipsData[chip].emulCnt += stepsPerBuffTN; //???
            if (chipsData[chip].emulCnt < stepsOutTN * e.outputBuffer.length) {
                chipsData[chip].emulCnt += chipEmulOverStep;
            }
            while (chipsData[chip].emulCnt > 0) {
                chipsData[chip].emulCnt -= 1;
                if (chipsData[chip].frameCnt >= chipFrameFrq) {
                    chipsData[chip].frameCnt -= chipFrameFrq;
                    // get new regs (only for 48000/2048/50)
                    var newRegs = fnPlayRegProvider();
                    for (ch = 0; ch < 3; ch++) {
                        chipsData[chip].tonePer[ch] = newRegs[chip].tonePer[ch] & 0x0FFF;
                        chipsData[chip].vol[ch] = newRegs[chip].vol[ch] & 0x0F;
                        chipsData[chip].mixTone[ch] = newRegs[chip].mixTone[ch];
                        chipsData[chip].mixNoise[ch] = newRegs[chip].mixNoise[ch];
                        chipsData[chip].mixEnv[ch] = newRegs[chip].mixEnv[ch];
                    }
                    if (chipsData[chip].envForm != newRegs[chip].envForm) {
                        chipsData[chip].envGenFaze = 0;
                        chipsData[chip].envForm = newRegs[chip].envForm & 0x0F;
                        chipsData[chip].envState = chipEnvInitState[chipsData[chip].envForm];
                    }
                    chipsData[chip].envPer = newRegs[chip].envPer & 0xFFFF;
                    chipsData[chip].envForm = newRegs[chip].envForm & 0x0F;
                    chipsData[chip].noisePer = newRegs[chip].noisePer & 0x1F;
                }
                // frame counter
                chipsData[chip].frameCnt += 16;
                
                
                // envelope counter
                chipsData[chip].envCnt++;
                if (chipsData[chip].envCnt >= chipsData[chip].envPer) {
                    chipsData[chip].envCnt = 0;
                }
                
                // envelope process
                if (chipsData[chip].envCnt == 0) {
                    //--------------------------  \|\|\|\|
                    if (chipsData[chip].envForm == 8) {
                        chipsData[chip].envState--;
                        if (chipsData[chip].envState < 0 ) {
                            chipsData[chip].envState = 31;
                        }
                    //--------------------------  /|/|/|/|
                    } else if (chipsData[chip].envForm == 12) {
                        chipsData[chip].envState++;
                        chipsData[chip].envState = chipsData[chip].envState & 31;
                    //--------------------------  \/\/\/\/
                    } else if (chipsData[chip].envForm == 10) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState--;
                            if (chipsData[chip].envState < 0) {
                                chipsData[chip].envState = 0
                                chipsData[chip].envGenFaze ^= 1;
                            }
                        } else {
                            chipsData[chip].envState++;
                            if (chipsData[chip].envState > 31) {
                                chipsData[chip].envState = 31
                                chipsData[chip].envGenFaze ^= 1;
                            }
                        }
                    //--------------------------  /\/\/\/
                    } else if (chipsData[chip].envForm == 14) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState++;
                            if (chipsData[chip].envState > 31) {
                                chipsData[chip].envState = 31
                                chipsData[chip].envGenFaze = 1;
                            }
                        } else {
                            chipsData[chip].envState--;
                            if (chipsData[chip].envState < 0) {
                                chipsData[chip].envState = 0
                                chipsData[chip].envGenFaze = 0;
                            }
                        }
                    //--------------------------  \____   0,1,2,3,9
                    } else if (chipsData[chip].envForm <= 3 || chipsData[chip].envForm == 9) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState--;
                            if (chipsData[chip].envState <= 0) {
                                chipsData[chip].envState = 0;
                                chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  /|____   4,5,6,7,15
                    } else if ((chipsData[chip].envForm >= 4 && chipsData[chip].envForm <= 7) || chipsData[chip].envForm == 31) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState++;
                            if (chipsData[chip].envState > 31) {
                                chipsData[chip].envState = 0;
                                chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  \|"""" 11
                    } else if (chipsData[chip].envForm == 11) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState--;
                            if (chipsData[chip].envState < 0) {
                                chipsData[chip].envState = 31;
                                chipsData[chip].envGenFaze = 1;
                            }
                        }
                    //--------------------------  /"""" 13
                    } else if (chipsData[chip].envForm == 13) {
                        if (chipsData[chip].envGenFaze == 0) {
                            chipsData[chip].envState++;
                            if (chipsData[chip].envState >= 31) {
                                chipsData[chip].envState = 31;
                                chipsData[chip].envGenFaze = 1;
                            }
                        }
                    }
                }

                // noise
                chipsData[chip].nCnt++;
                if (chipsData[chip].nCnt >= chipsData[chip].noisePer) {
                    chipsData[chip].nCnt = 0;
                    // (c)http://www.vgmpf.com/Wiki/images/7/7c/AY8930_-_Manual.pdf
                    // bit0 xor bit2, roll right, xored value to bit16, bit1 to result
                    // var bit0x2 = (chipsData[chip].shiftreg & 1) ^ ((chipsData[chip].shiftreg >> 3) & 1);
                    // chipsData[chip].shiftreg = (chipsData[chip].shiftreg >>> 1) + (bit0x2 << 16);
                    // chipsData[chip].nState = chipsData[chip].shiftreg & 1;
                    
                    // (c)ayumi
                    // bit0 xor bit3, roll right, xored value to bit16, bit1 to result
                    var bit0x3 = (chipsData[chip].shiftreg & 1) ^ ((chipsData[chip].shiftreg >> 3) & 1);
                    chipsData[chip].shiftreg = (chipsData[chip].shiftreg >>> 1) + (bit0x3 << 16);
                    chipsData[chip].nState = chipsData[chip].shiftreg & 1;
                }
                // tones a,b,c & mixing
                for (ch = 0; ch < 3; ch++) {
                    // tone a
                    chipsData[chip].tCnt[ch]++;
                    if (chipsData[chip].tCnt[ch] >= chipsData[chip].tonePer[ch]) {
                        chipsData[chip].tCnt[ch] = 0;
                        chipsData[chip].tState[ch] ^= 1;
                    }
                    // mix
                    var out = chipsData[chip].mixTone[ch] == 0 ? 1 : chipsData[chip].tState[ch];
                    out &= chipsData[chip].mixNoise[ch] == 0 ? 1 : chipsData[chip].nState;
                    out *= chipsData[chip].mixEnv[ch] == 0 ? chipVolTbl[chipType][chipsData[chip].vol[ch] * 2 + 1]
                        : chipVolTbl[chipType][chipsData[chip].envState];
                    //out to buff
                    chipsChannelsBuff[chip][ch][step] = out;
                }
                step++;
            }
        }
        //-- resample & render (first time just float step)
        var step = 0;
        var idx = 0;
        for (var i = 0; i < e.outputBuffer.length; i++) {
            step += stepsOutTN;
            idx = Math.round(step);
            for (var chip = 0; chip < chipQty; chip++) {
                for (var ch = 0; ch < 3; ch++) {
                    output[chip][ch][i] = chipsChannelsBuff[chip][ch][idx];
                }
            }
        }
    } else {
        //--- silence
        for (var i = 0; i < e.outputBuffer.length; i++) {
            for (var chip = 0; chip < chipQty; chip++) {
                for (var ch = 0; ch < 3; ch++) {
                    output[chip][ch][i] = 0;
                }
            }
        }
    }
}

var gainNode = context.createGain(); //global tracker volume
    gainNode.gain.value = 1;
    scriptNode.connect(gainNode);

var splitterNode = context.createChannelSplitter(chipQty*3); //for mix ABC to stereo
    gainNode.connect(splitterNode);

var mergerNode = context.createChannelMerger(2);
var gainNodeB = [];
    for (var chip = 0; chip < chipQty; chip++) {
        var chA = chip * chipQty + 0;
        var chB = chip * chipQty + 1;
        var chC = chip * chipQty + 2;
        //-- ch b
        gainNodeB[chip] = context.createGain();
        gainNodeB[chip].gain.value = chipChBVol;
        splitterNode.connect(gainNodeB[chip], chB);
        gainNodeB[chip].connect(mergerNode, 0, 0);
        gainNodeB[chip].connect(mergerNode, 0, 1);
        //-- ch a
        splitterNode.connect(mergerNode, chA, 0);
        //-- ch c
        splitterNode.connect(mergerNode, chC, 1);
    }
    mergerNode.connect(context.destination);

function playerPlay() {
    chipReset();
    chipIsPlay = 1;
}
function playerStop() {
    chipIsPlay = 0;
    chipReset();
}