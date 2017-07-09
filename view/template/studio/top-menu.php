<div class="top-menu">
    <ul>
        <li>
            <a>File</a>
            <ul>
                <li><a id="ctrl-module-new">New</a></li>
                <li><a id="ctrl-module-open">Open</a></li>
                <li><a id="ctrl-module-save">Save</a></li>
            </ul>
        </li>
        <li>
            <a href="<?=$this->getHref('studio')?>">Edit</a>
            <ul>
                <li><a id="ctrl-edit-clear-patt">Clear&nbsp;current&nbsp;pattern</a></li>
            </ul>
        </li>
        <li>|</li>
            <li><a class="layout-change" data-layout-id="tracker">Tracker</a></li>
            <li><a class="layout-change" data-layout-id="sampler">Sampler</a></li>
        <li>|</li>
        <li>
            <a href="<?=$this->getHref('user', 'settings')?>">Settings</a>
        </li>
    </ul>
</div>
<div class="top-ctrl">
    <div class="ctrl"><?
        ?><a class="ctrl-btn ctrl-stop"><span></span></a><?
        ?><a class="ctrl-btn ctrl-play"><span></span></a><?
        ?><a class="ctrl-btn ctrl-play-beg"><div></div><span></span></a><?
        ?><a class="ctrl-btn ctrl-play-patt"><span></span></a><?
        ?><a class="ctrl-btn ctrl-play-patt-beg"><div></div><span></span></a><?
    ?></div>
    <div class="ctrl-chip-select">
        Chip:<a class="ctrl-btn ctrl-chip-select">YM</a>
        ChipFrq:<a class="ctrl-btn ctrl-chip-frq">1773400</a>
    </div>
    <div class="ctrl-volume">
        <input class="ctrl-volume" type="range" name="ctrl-volume" step="0.05" min="0" max="1" value="1" oninput="fnCtrlVolume(this.value)" />
    </div>
</div>
<div class="clearfix"></div>