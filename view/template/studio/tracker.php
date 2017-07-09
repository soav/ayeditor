<div class="track-wrap">
    <div class="track"></div>
    <div class="track-ctrl-wrap">
        <div class="track-ctrl track-ctrl__ins">Ins</div>
        <div class="track-ctrl track-ctrl__add">Add</div>
        <div class="track-ctrl track-ctrl__del">Del</div>
    </div>
</div>
<div class="block-container pattern-container">
    <div class="block-border">

        <div class="block-wrap pattern-wrap">
        <div class="pattern-head">
            <table>
                <tr>
                    <td rowspan="2"><div class="hdr-sel pos">Pos</div></td>
                    <td rowspan="2"><div class="sep"><b></b></div></td>
                    <td colspan="3"><div class="hdr-sel">Env</div></td>
                    <td rowspan="2"><div class="sep"><b></b></div></td>
                    <td rowspan="2"><div class="hdr-sel noise">N</div></td>
                    <td rowspan="2"><div class="sep"><b></b></div></td>
                    <?
                    $channels = array('A', 'B', 'C');
                    for ($ch = 0; $ch < 3; $ch++) {?>
                    <td colspan="4"><div class="ch hdr-sel"><?= $channels[$ch] ?></div>
                        <div class="patt-hdr-env"><span>2</span>:<span>3</span></div>
                        <div class="patt-hdr-ctrl"><span class="mix-t active" data-chip="0" data-ch="<?=$ch?>">T</span><span class="mix-n active" data-chip="0" data-ch="<?=$ch?>">N</span><span class="mix-e active" data-chip="0" data-ch="<?=$ch?>">E</span></div>
                    </td>
                    <td rowspan="2"><div class="sep"><b></b></div></td>
                    <?}?>
                    <td rowspan="2"><div class="hdr-sel speed">S</div></td>
                </tr>
                <tr>
                    <td><div class="hdr-sel env-per">Per</div></td>
                    <td><div class="hdr-sel env-note">Note</div></td>
                    <td><div class="hdr-sel env-form">F</div></td>
                    <td><div class="hdr-sel ch-note">Note</div></td>
                    <td><div class="hdr-sel ch-iso">ISO</div></td>
                    <td><div class="hdr-sel ch-vol">V</div></td>
                    <td><div class="hdr-sel ch-fx">FX</div></td>
                    <td><div class="hdr-sel ch-note">Note</div></td>
                    <td><div class="hdr-sel ch-iso">ISO</div></td>
                    <td><div class="hdr-sel ch-vol">V</div></td>
                    <td><div class="hdr-sel ch-fx">FX</div></td>
                    <td><div class="hdr-sel ch-note">Note</div></td>
                    <td><div class="hdr-sel ch-iso">ISO</div></td>
                    <td><div class="hdr-sel ch-vol">V</div></td>
                    <td><div class="hdr-sel ch-fx">FX</div></td>
                </tr>
            </table>
        </div>
            <div class="play-block"></div>
            <div class="pattern-cursor-top"></div>
            <div class="pattern-cursor-bott"></div>
               <div class="vert-sep sep-env"></div>
            <div class="vert-sep sep-noise"></div>
            <div class="vert-sep sep-a"></div>
            <div class="vert-sep sep-b"></div>
            <div class="vert-sep sep-c"></div>
            <div class="vert-sep sep-speed"></div>
            <div class="pattern"></div>
            <?/*<canvas id="c-pattern" class="c-pattern" width="526px" height="1px"></canvas>*/?>
            <div id="pattern" class="pattern" width="526px" height="1px"></div>
        </div>
    </div>
</div>

<div class="block-container ins-container">
    <div class="block-border">
        <div class="block-wrap">
            <div class="instruments selector"></div>
        </div>
    </div>
</div>
<div class="block-container sam-container">
    <div class="block-border">
        <div class="block-wrap">
            <div class="samples selector"></div>
        </div>
    </div>
</div>
<div class="block-container orn-container">
    <div class="block-border">
        <div class="block-wrap">
            <div class="ornaments selector"></div>
        </div>
    </div>
</div>
<div class="block-container lay-container">
    <div class="block-border">
        <div class="block-wrap">
            <div class="layers selector"></div>
        </div>
    </div>
</div>