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
var chipFrq = 1773400   //1773400;  // 1773400 - Original ZX, 1750000 - Pentagon (3546895/2=1773447.5)
var chipChBVol = 0.75;  //???
var chipFrameFrq = 70908; // 70908 - Original ZX, 71680 - Pentagon
var frameFrq = 50;      // 50 - Original ZX, 48.828 - Pentagon

var chipFrameCounter = 0; //calc fps for next reg data

var chipVolTbl = [
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

var AudioContextLnk = window.AudioContext || window.webkitAudioContext;

var bufferSize = 2048; //scriptNode process buffer size 256/512/1024...16384
var context = new AudioContextLnk();

var emulRate = 1;


var stepsPerBuffTN = bufferSize * chipFrq / context.sampleRate / emulRate;
console.log(stepsPerBuffTN);
var stepsOutTN = chipFrq / context.sampleRate / emulRate;
var chipEmulOverStep = chipFrq / emulRate / context.sampleRate;

var chBuffSize = Math.ceil(stepsPerBuffTN + 2 * chipEmulOverStep);

var frameFrqTick = 0;
var frameFrqTickMax = (context.sampleRate / frameFrq) / 2;

var chipIsPlay = 0;
var chipChannelsBuff = [];
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
        stepCnt: 0,
        frameCnt: 0,
        chBuffCnt: 0,
    };
    chipChannelsBuff[chip] = [];
    for (ch = 0; ch < 3; ch++) {
        chipChannelsBuff[chip][ch] = [];
        for (var i = 0; i < chBuffSize ; i++) {
            chipChannelsBuff[chip][ch][i] = 0;            
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
        //emul counters
        chipsData[chip].stepCnt = 0;
        chipsData[chip].chBuffCnt = 0;
        chipsData[chip].frameCnt = chipFrameFrq;
        
        //clear buffers
        for (ch = 0; ch < 3; ch++) {
            for (var i = 0; i < chBuffSize ; i++) {
                chipChannelsBuff[chip][ch][i] = 0;
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
        var chBuffCnt = chipsData[0].chBuffCnt + 0;
        var chBuffCntL = chipsData[0].stepCnt + 0;
        for (var chip = 0; chip < chipQty; chip++) {
            //var step = chipsData[chip].chBuffCnt;
            if (chipsData[chip].chBuffCnt >= chBuffSize) {
                chipsData[chip].chBuffCnt -= chBuffSize;
            }
            chipsData[chip].stepCnt += stepsPerBuffTN; //???
            if (chipsData[chip].stepCnt < stepsOutTN * e.outputBuffer.length) {
                chipsData[chip].stepCnt += chipEmulOverStep;
            }
            while (chipsData[chip].stepCnt > 0) {
                chipsData[chip].stepCnt -= 1;
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
                var emulMlt = 8;
                chipsData[chip].frameCnt += 16 / emulMlt;
                
                // envelope counter
                chipsData[chip].envCnt++;
                if (chipsData[chip].envCnt >= chipsData[chip].envPer * emulMlt) {
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
                if (chipsData[chip].nCnt >= chipsData[chip].noisePer * emulMlt) {
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
                    if (chipsData[chip].tCnt[ch] >= chipsData[chip].tonePer[ch] * emulMlt) {
                        chipsData[chip].tCnt[ch] = 0;
                        chipsData[chip].tState[ch] ^= 1;
                    }
                    // mix
                    var out = chipsData[chip].mixTone[ch] == 0 ? 1 : chipsData[chip].tState[ch];
                    out &= chipsData[chip].mixNoise[ch] == 0 ? 1 : chipsData[chip].nState;
                    out *= chipsData[chip].mixEnv[ch] == 0 ? chipVolTbl[chipType][chipsData[chip].vol[ch] * 2 + 1]
                        : chipVolTbl[chipType][chipsData[chip].envState];
                    //out to buff
                    chipChannelsBuff[chip][ch][chipsData[chip].chBuffCnt] = out;
                }
                chipsData[chip].chBuffCnt++;
                if (chipsData[chip].chBuffCnt >= chBuffSize) {
                    chipsData[chip].chBuffCnt -= chBuffSize;
                }
            }
        }
        //-- resample & render (first time just float step)
        //var chBuffCnt = chipsData[0].chBuffCnt + 0;
        //var chBuffCntL = chipsData[0].stepCnt + 0;
        console.log(chBuffCnt, chBuffCntL);
        var step = chBuffCnt + chBuffCntL;
        var idx = 0;
        for (var i = 0; i < e.outputBuffer.length; i++) {
            idx = Math.round(step);
            if (idx >= chBuffSize) {
                idx -= chBuffSize;
            } else if (idx < 0) {
                idx += chBuffSize;
            }
            idxl = Math.floor(step);
            idxr = Math.ceil(step + stepsOutTN);
            for (var chip = 0; chip < chipQty; chip++) {
                for (var ch = 0; ch < 3; ch++) {
                    /*var out = 0;
                    var outCnt = 0;
                    var idx0 = idxl;
                    while (idx0 < idxr) {
                        var idx00 = idx0;
                        if (idx00 >= chBuffSize) {
                            idx00 -= chBuffSize;
                        } else if (idx00 < 0) {
                            idx00 += chBuffSize;
                        }
                        
                        out += chipChannelsBuff[chip][ch][idx00];
                        idx0++;
                        outCnt++;
                    }
                    out = out / outCnt;
                    output[chip][ch][i] = out;
                    */
                    output[chip][ch][i] = chipChannelsBuff[chip][ch][idx];
                }
            }
            step += stepsOutTN;
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