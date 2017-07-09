<?php
header("Content-type: text/css");
require_once ('../../protected/engine/App.php');
$configFilename = '../../protected/config/config_front.php';
App::createWebApplication($configFilename);
$colors = App::apl()->db->key_results("color_key", "color_val", "SELECT * FROM y_color_shemes_colors
    WHERE color_shemes_id = '" . App::apl()->user->getSettingsValue('colorShemeId') . "'"
);
$defaultColors = App::apl()->db->key_results("color_shemes_keys_id", "color_shemes_default_value", "SELECT * FROM y_color_shemes_keys");
function getColor($colorId) {
    global $colors, $defaultColors;
    return isset($colors[$colorId]) ? $colors[$colorId] : $defaultColors[$colorId];
}?>

/*--- BASE INTERFACE ---*/
@font-face {
    font-family: "SegoeUIMonoRegular";
    src: url('<?=App::apl()->config['app']['appWebRoot']?>/media/fonts/segeo-ui-mono-regular-webfont.eot?#iefix') format('embedded-opentype'),
         url('<?=App::apl()->config['app']['appWebRoot']?>/media/fonts/segeo-ui-mono-regular-webfont.woff') format('woff'),
         url('<?=App::apl()->config['app']['appWebRoot']?>/media/fonts/segeo-ui-mono-regular-webfont.ttf')  format('truetype'),
         url('<?=App::apl()->config['app']['appWebRoot']?>/media/fonts/segeo-ui-mono-regular-webfont.svg#SegoeUIMonoRegular') format('svg');
    font-weight: normal;
    font-style: normal;
}

html, body,
input, textarea,
table tr td, table tr th,
div {
    font-family: "SegoeUIMonoRegular";
    font-size: 12px;
    line-height: 14px;
}

html, body {
    height: 100%;
    padding: 0px;
    margin: 0px;
    background-color: #<?=getColor('bg')?>;
    color: #<?=getColor('text')?>;
	cursor: default;
}

a {
    cursor: pointer;
    text-decoration: none;
    color: #<?=getColor('text')?>;
}
a:hover {
    text-decoration: underline;
}
input[type="text"] {
    margin: 0px;
    padding: 4px 5px;
    border: 1px solid #202020;
    border-radius: 5px;
}
input[type="range"] {
    display: block;
    -webkit-appearance: none;
    background-color: transparent;
    width: 100px;
    position: relative;
    top: 4px;
}
input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 4px;
    background-color: #<?=getColor('workspaceBg')?>;
    border: 1px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
    position: relative;
    top: 4px;
}

input[type=range]::-moz-range-track {
    height: 2px;
    background-color: #<?=getColor('workspaceBg')?>;
    border: 1px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
}

input[type=range]::-ms-track {
    height: 2px;
    background-color: #<?=getColor('workspaceBg')?>;
    border: 1px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
}

input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -7px;
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: #<?=getColor('text')?>;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
    
}
input[type=range]::-moz-range-thumb {
    border: none;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: #<?=getColor('text')?>;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
}
input[type=range]::-ms-thumb {
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background-color: #<?=getColor('text')?>;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
    cursor: pointer;
}



input[type="range"]:focus {
    outline: none;
}

.clearfix {
    clear: both;
}

.btn {
    display: inline-block;
    padding: 4px 10px;
    border: 1px solid #202020;
    border-radius: 5px;
    background-color: #E8E8E8;
    color: black;
    background: linear-gradient(to bottom, #f0f0f0 0%,#e0e0e0 50%,#d0d0d0 50%,#909090 100%);
    cursor: pointer;
}
.btn:hover {
    box-shadow: 0 0 5px RGBA(255,255,255, 0.5);
    border-color: #004080;
    color: #0060A0;
    text-decoration: none;
}
div.waitbox {
    width: 32px;
    height: 32px;
    background: url("<?=App::apl()->config['app']['appWebRoot']?>/view/img/icon-wait.gif") top left no-repeat;
    margin: 10px;
}

.warning-text {
    color: #<?=getColor('warningText')?>;
}

.header {
    color: #<?=getColor('topHeaderText')?>;
    background-color: #<?=getColor('topHeaderBg')?>;
}
.header-block {
    padding: 2px 10px;
}

table {
    border-collapse: collapse;
    padding: 0xp;
    margin: 0px;
}
table td,
table th {
    padding: 0px;
}

table.form td {
    padding: 2px 5px;
    vertical-align: middle;
}

div.layout-container {
    display: none;
    clear: both;
}
div.layout-container.selected {
    display: block;
}

div.block-container {
    float: left;
    display: block;
    color: #<?=getColor('workspaceText')?>;
    background-color: #<?=getColor('workspaceBg')?>;
    border: 1px solid #<?=getColor('bg')?>;
}
div.block-wrap {
    display: block;
    position: relative;
    color: #<?=getColor('workspaceText')?>;
    background-color: #<?=getColor('workspaceBg')?>;
}
div.block-border {
    display: block;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
    padding: 4px;
}
div.block-container.active {
    border-color: #<?=getColor('workspaceActiveBlockBorder')?>;
}


div.selector {
    display: block
    overflow-y: auto;
}
div.selector div.selector-item {
    display: block;
    white-space: nowrap;
    padding: 0px 2px;
}
div.selector div.selector-item:hover {
    background-color: #<?=getColor('workspaceSelectedRowBg')?>;
}
div.selector div.selector-item.selected {
    background-color: #<?=getColor('workspaceSelectedRowBg')?>;
}

div.color-picker {
    width: 32px;
    height: 14px;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
}

div.oauth-servers {
    padding-top: 20px;
}
div.oauth-server {
    display: inline-block;
    margin: 5px;
    border: 1px solid #202020;
}
div.oauth-server:hover {
    border-color: #ffffff;
    box-shadow: 0 0 5px RGBA(255,255,255, 0.5);
}
div.oauth-server img {
    display: block;
    height: 32px;
}

/*--- TOP HEADER ---*/
div.top-header {
    font-weight: bold;
    padding: 4px 12px;
    background-color: #<?=getColor('topHeaderBg')?>;
}
div.top-header span {
    display: inline-block;
}
div.top-header img {
    display: inline-block;
    margin-right: 4px;
}
div.top-header span.user {
    display: inline-block;
    float: right;
}

div.top-menu {
    padding: 0px 4px;
}

div.top-menu ul {
    margin: 0px;
    padding: 0px;
    list-style: none;
    background-color: #<?=getColor('bg')?>;
    z-index: 100;
}

div.top-menu ul li {
    display: inline-block;
    position: relative;
}

div.top-menu ul li > ul {
    position: absolute;
    border: 1px solid #000;
    display: none;
}

div.top-menu a {
    display: block;
    padding: 4px 8px;
    font-weight: bold;
    color: #<?=getColor('text')?>;
}

div.top-menu li:hover > ul {
    display: block;
}

/*--- TRACK ---*/
div.track-wrap {
    float: left;
    display: inline-block;
    color: #<?=getColor('workspaceText')?>;
    background-color: #<?=getColor('workspaceBg')?>;
    border: 2px solid #<?=getColor('workspaceBorder')?>;
    padding: 6px 4px 4px 4px;
    position: relative;
    width: 140px;
    margin-left: 6px;
}
div.track-pos {
    border-radius: 5px;
    border: 2px solid transparent;
    padding: 1px;
    width: 131px;
    height: 16px;
    overflow: show;
    margin-top: -2px;
    
}
div.track-pos.active {
    border: 2px solid #8E8E8E;
}
input.track-pos-id {
    border: none !important;
    border-radius: 3px;
    background-color: #<?=App::apl()->config['params']['COLOR_TRACK_POS_BG_ACTIVE']?>;
    display: block;
    float: left;
    width: 22px;
    height: 14px;
    padding: 1px 0px;
    text-align: center;
    margin: 0px 1px 0px 0px;
    cursor: pointer;
    color: #fff;
}
input.track-pos-name {
    border-radius: 3px;
    background-color: #<?=App::apl()->config['params']['COLOR_TRACK_POS_BG']?>;
    display: block;
    float: left;
    width: 96px;
    height: 14px;
    padding: 1px 5px 1px 5px;
    margin-top: -1px;
    color: #a0a0a0;
}

/*--- PATTERN ---*/

div.pattern-container {
    margin-left: 6px;
}
div.pattern-wrap {
    position: relative;
    height: <?=14*36?>px;
    overflow: hidden;
    padding: 0px;
}
div.pattern-wrap div.pattern-cursor-top {
    width: 100%;
    height: 1px;
    z-index: 1;
    background-color: RGBA(0,128,255, 0.5);
    top: 50%;
    position: absolute;
    transform: translate3d(0px,-15px,0px);
}
div.pattern-wrap div.pattern-cursor-bott {
    width: 100%;
    height: 1px;
    z-index: 1;
    background-color: RGBA(0,128,255, 0.5);
    top: 50%;
    position: absolute;
    transform: translate3d(0px,-1px,0px);
}
div.pattern {
    display: table;
}

div.pattern-wrap div.vert-sep {
	height: 100%;
	width: 10px;
	background-color: RGBA(255,255,255, 0.01);
	position: absolute;
	z-index: 1;
	top: 0px;
}
div.pattern-wrap div.vert-sep.sep-env {
	left: 26px;
}
div.pattern-wrap div.vert-sep.sep-noise {
	left: 114px;
}
div.pattern-wrap div.vert-sep.sep-a {
	left: 144px;
}
div.pattern-wrap div.vert-sep.sep-b {
	left: 262px;
}
div.pattern-wrap div.vert-sep.sep-c {
	left: 379px;
}
div.pattern-wrap div.vert-sep.sep-speed {
	left: 496px;
}



/*--- PATTERN HEAD ---*/
div.pattern-head {
	position: absolute;
	top: 0px;
	left: 0px;
	z-index: 101;
	background-color: #<?=getColor('workspaceBg')?>;
}
div.pattern-head table {
	border-collapse: collapse;
	border-bottom: 1px solid #<?=getColor('pattLines')?>;
	margin-bottom: 1px;
}
div.pattern-head table td {
	padding: 0px;
	text-align: center;
	height: 100%;
}
div.pattern-head table td div.pos {
	width: 26px;
}
div.pattern-head table td div.sep {
	display: inline-block;
    height: 100%;
    width: 10px;
}
div.pattern-head table td div.sep b {
	display: inline-block;
	width: 2px;
	height: 100%;
	background-color: #<?=getColor('pattLines')?>;
}


div.pattern-head table td div.env-per {
	width: 36px;
}
div.pattern-head table td div.env-note {
	width: 28px;
}
div.pattern-head table td div.env-form {
	width: 12px;
}
div.pattern-head table td div.noise {
	width: 20px;
}
div.pattern-head table td div.ch-note {
	width: 30px;
}
div.pattern-head table td div.ch-iso {
	width: 25px;
}
div.pattern-head table td div.ch-vol {
	width: 12px;
}
div.pattern-head table td div.ch-fx {
	width: 38px;
}
div.pattern-head table td div.speed {
	width: 20px;
}

div.pattern-head table td div {
    display: inline-block;
}

div.pattern-head table td div.ch {
    padding: 0px 10px;
}

div.pattern-head table td div.hdr-sel:hover {
    background-color: #<?=getColor('workspaceSelectedRowBg')?>;
}

div.patt-hdr-ctrl {
    display: inline-block;
    float: right;
}
div.patt-hdr-ctrl span {
    color: #FF0000;
    padding: 0px 4px;
}
div.patt-hdr-ctrl span.active {
    color: #00F000;
}
div.patt-hdr-ctrl span:hover {
    background-color: #<?=getColor('workspaceSelectedRowBg')?>;
}

div.patt-hdr-env {
    display: inline-block;
    float: right;
    margin-left: 6px;
    padding: 0px 2px;
    color: #0080FF;
}
div.patt-hdr-env:hover {
    background-color: #<?=getColor('workspaceSelectedRowBg')?>;
}



/*--- PATTERN POS ---*/
div.pattern-pos {
    display: block;
    overflow: hidden;
    height: 14px;
}
div.pattern-pos div,
div.pattern-pos span {
    display: inline-block;
}

div.pattern-pos span.space {
    margin-left: 5px;
}

div.pattern-pos.highlight {
    background-color: #<?=getColor('pattHighlightBg')?>;    
}

div.pattern-pos div.sep {
    height: 100%;
    width: 2px;
    padding: 0px 4px;
    margin: 0px 2px;
    background-color: #<?=getColor('workspaceBg')?>;
}
div.pattern-pos div.sep b {
    display: block;
    width: 2px;
    background-color: #<?=getColor('pattLines')?>;
}

div.pattern-pos div.pattern-pos-id {
    padding-left: 8px;
    padding-right: 2px;
    color: #<?=getColor('pattPosText')?>;
    font-weight: bold;
}
div.pattern-pos.highlight div.pattern-pos-id {
    color: #<?=getColor('pattPosHighlightText')?>;
}

div.pattern-pos span {
    color: #<?=getColor('pattText')?>;
    font-weight: bold;
    padding-right: 1px;
}

div.pattern-pos span:last-child {
    padding-right: 2px;
}

div.pattern-pos.highlight span {
    color: #<?=getColor('pattHighlightText')?>;
}

div.pattern-pos span.curr,
div.pattern-pos span:hover {
    background-image: linear-gradient(to bottom, RGBA(255,255,255, 0.10), RGBA(255,255,255, 0.10));
}

/*--- ISO ---*/
div.ins-container,
div.sam-container,
div.orn-container,
div.lay-container {
    margin-left: 6px;
}

div.ins-container div,
div.sam-container div,
div.orn-container div,
div.lay-container div {
    overflow: hidden;
    width: 100px;
}
div.lay-container div {
    width: 120px;
}

/*--- SAMPLER HEADER ---*/
div.sampler-header div,
div.sampler-orn-header div,
div.sampler-play-header div {
    display: inline-block;
}
div.sampler-header > div,
div.sampler-orn-header > div,
div.sampler-play-header > div {
    overflow: hidden;
    margin: 0px;
    text-align: center;
}
div.sampler-orn-header div.slide {
    width: 34px;
}
div.sampler-header div.pos,
div.sampler-orn-header div.pos {
    width: 22px;
}
div.sampler-header div.mix {
    width: 76px;
}
div.sampler-header div.env {
    width: 116px;
}
div.sampler-header div.noise {
    width: 48px;
}
div.sampler-header div.note {
    width: 69px;
}
div.sampler-header div.vol {
    width: 200px;
    padding-right: 5px;
}

div.sampler-header div.sep,
div.sampler-orn-header div.sep,
div.sampler-play-header div.sep,
div.sampler-pos div.sep,
div.sampler-orn-pos div.sep,
div.sampler-play-pos div.sep {
    overflow: hidden;
	display: inline-block;
    width: 10px;
    text-align: center;
}
div.sampler-header div.sep b,
div.sampler-orn-header div.sep b,
div.sampler-play-header div.sep b,
div.sampler-pos div.sep b,
div.sampler-orn-pos div.sep b,
div.sampler-play-pos div.sep b {
	display: inline-block;
	width: 2px;
	background-color: #<?=getColor('pattLines')?>;
}

/*--- SAMPLER POS ---*/
div.sampler div.sampler-pos div.volume {
    overflow: inherit;
}
div.sampler div.sampler-pos div.vol {
    display: inline-block;
    width: 8px;
    height: 14px;
    border: 1px solid #434343;
    margin-right: 2px;
}
div.sampler div.sampler-pos div.vol.on {
    background-color: #F16A32;
}
div.sampler div.sampler-pos div.vol:first-child {
    background-color: transparent !important;
    border-color: transparent !important;
}
div.sampler div.sampler-pos div.mix {
    padding: 0px 2px;
}
div.sampler div.sampler-pos div.mix div {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1px solid #434343;
    margin-right: 1px;
    margin-left: 1px;
    text-align: center;
    color:#808080;
}
div.sampler div.sampler-pos div.mix div.on {
    background-color: #2050c0;
    color: #FFFFFF;
}
div.sampler div.sampler-pos div.noise {
    overflow: hidden;
    padding: 0px 5px;
}
div.sampler div.sampler-pos div.note {
    overflow: hidden;
}
div.sampler div.sampler-pos div.note-slider {
    margin-left: 8px;
    margin-right: 2px;
}
div.sampler div.sampler-pos div.note-slider span {
}
div.sampler div.sampler-pos div.env-note {
    margin-left: 6px;
}
div.sampler div.sampler-pos div.env-form {
    margin-left: 6px;
}
div.sampler div.sampler-pos div.env-slider {
    margin-left: 8px;
}

div.sampler-section {
    text-align: right;
    overflow: hidden;
    cursor: n-resize;
}
div.sampler-section div {
    position: relative;
}
div.sampler-section div span {
    width: 100%;
    height: 2px;
    background-color: #808080;
    position: absolute;
    top: 50%;
    left: 0px;
    margin-top: -1px;
    z-index: 1;
    margin-left: -30px;
}
div.sampler-section.sampler-section-100 div span {
    margin-left: 0px;
}
div.sampler-section.sampler-section-attack {
    cursor: inherit;
}


/*--- SAMPLER PLAY ---*/
div.sampler-play-header div.env {
    width: 68px;
}
div.sampler-play-header div.noise {
    width: 14px;
}
div.sampler-play-pos div.env-note {
    margin-left: 6px
}
div.sampler-play-pos div.env-form {
    margin-left: 6px
}
div.sampler-play-pos div.note {
    width: 28px;
    text-align: center;
}
/*--- SAMPLER PLAY POS ---*/


table.tbl-layout tr td {
    padding-left: 6px;
    padding-bottom: 6px;
}







/*--- POSITIONS ---*/
div.pos {
    height: 14px;
}
div.layout-sampler div.pos {
    padding: 2px 0px;
}
div.pos div.pos-id {
    width: 22px;
    text-align: right;
}

div.pos span,
div.pos div {
    display: inline-block;
    white-space: nowrap;
}
div.pos > span,
div.pos > div {
    overflow: hidden;
}
div.pos > span.m,
div.pos > div.m {
    margin-left: 6px;
}
div.pos:hover {
    background-color: RGBA(255,255,255, 0.07);
}
div.pos.curr-pos,
div.pos.curr-pos:hover {
    background-color: RGBA(100,220,255, 0.15);
}
div.pos > span.curr:hover,
div.pos > span.curr {
    background-color: RGBA(255,255,255, 0.75);
    color: #000;    
}

div.pos > span.curr {
    -webkit-animation: rainbow 1s linear infinite;
}
@-webkit-keyframes rainbow {
0% { background-color: RGBA(255,255,255, 0.75); color: #000; }
49% { background-color: RGBA(255,255,255, 0.75); color: #000; } 
50% {background-color: RGBA(255,255,255, 0.15); color: #fff; }
100% {background-color: RGBA(255,255,255, 0.15); color: #fff; }
}



div.pos > span:hover {
    background-color: RGBA(255,255,255, 0.15);
}

div.slide-type:hover {
    background-color: RGBA(255,255,255, 0.25);
}

/*--- POSITIONS SAMPLER-PLAY-POS ---*/

div.sampler-play-pos span.note {
    width: 28px;
    text-align: center;
}

.deprecated {
    color: #800000 !important;
}

.top-ctrl {
    padding: 0px 8px;
}
.top-ctrl > div {
    float: left;
}

/*--- CTRL BUTTONS ---*/
.ctrl-btn {
    display: inline-block;
    min-width: 14px;
    height: 14px;
    padding: 4px;
    position: relative;
    border: 1px solid RGBA(255,255,255, 0.1);
    text-decoration: none !important;
    opacity: 0.75;
}
.ctrl-btn:hover {
    border-color: #fff;
    opacity: 1;
}
.ctrl-btn:active {
    top: 1px;
    left: 1px;
}
.ctrl-stop span {
    display: block;
    float: left;
    height: 12px;
    width: 12px;
    background-color: #fff;
    margin: 1px;
}
.ctrl-play span,
.ctrl-play-beg span {
    display: block;
    border-left: 10px solid #fff;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    float: left;
}
.ctrl-play-beg div {
    display: block;
    float: left;
    height: 14px;
    width: 2px;
    background-color: #fff;
    margin-right: 2px;
}
.ctrl-play-patt span,
.ctrl-play-patt-beg span {
    display: block;
    border-top: 10px solid #fff;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
}
.ctrl-play-patt span {
    margin-top: 2px;
}

.ctrl-play-patt-beg div {
    display: block;
    height: 2px;
    width: 14px;
    background-color: #fff;
    margin-bottom: 2px;
}

div.ctrl-chip-select {
    margin-left: 10px;
}

div.play-block {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: RGBA(0,0,0,0.01);
    z-index : 100;
    display: none;
}



div.track-ctrl-wrap {
    padding-top: 8px;
    text-align: right;
}
div.track-ctrl {
    display: inline-block;
    border: 1px solid #808080;
    color: #fff;
    padding: 2px 4px;
    opacity: 0.75;
    cursor: pointer;
}
div.track-ctrl:hover {
    opacity: 1;
    background-color: #606060;
    border-color: #fff;
}