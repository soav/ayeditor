<table class="tbl-layout">
    <tr valign="top">
        <td>
            <div>SAMPLE</div>
            <div class="block-container sampler-container">
                <div class="block-border">
                    <div class="block-wrap sampler-wrap">
                        <div class="sampler-header"><?
                            ?><div class="pos">#</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="mix">MIX</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="env">Env</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="noise">N</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="note">Tone</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="vol">Volume</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="loop">Loop</div><?
                        ?></div>
                        <div class="sampler"></div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <br />
            <div>
                beg size: <select id="sampler-size-atk"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select>
                l1b size: <select id="sampler-size-sus"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select>
                l1e size: <select id="sampler-size-rel"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select>
                l2b size: <select id="sampler-size-lp2"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select>
            </div>
        </td><td>
            <div>ORNAMENT</div>
            <div class="block-container sampler-orn-container"><?
                ?><div class="block-border"><?
                    ?><div class="block-wrap sampler-orn-wrap"><?
                        ?><div class="sampler-orn-header"><?
                            ?><div class="pos">#</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="slide">Sld</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="loop">Loop</div><?
                        ?></div><?
                        ?><div class="sampler-orn"></div><?
                    ?></div><?
                ?></div><?
            ?></div>
            <div class="clearfix">
                <br />
                <div>beg size: <select id="sampler-orn-size-atk"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select></div>
                <div>l1b size: <select id="sampler-orn-size-sus"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select></div>
                <div>l1e size: <select id="sampler-orn-size-rel"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select></div>
                <div>l2b size: <select id="sampler-orn-size-lp2"><?for ($i=0; $i<256; $i++) {?><option value="<?=$i?>"><?=$i?></option><?}?></select></div>
            </div>
        </td><td>
            <div>PLAY</div>
            <div class="block-container sampler-play-container">
                <div class="block-border">
                    <div class="block-wrap sampler-play-wrap">
                        <div class="sampler-play-header"><?
                            ?><div class="env">Env</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="noise">N</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="note">Tone</div><?
                            ?><div class="sep"><b>&nbsp;</b></div><?
                            ?><div class="vol">V</div><?
                        ?></div>
                        <div class="sampler-play"></div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
            <div align="right" style="padding-top:6px;"><a class="btn" id="sampler-play-btn">PLAY</a></div>
        </td><td>
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
        </td>
    </tr>
</table>
<div style="text-align:center;padding-top: 10px;">
    <div style="display:inline-block;text-align:left;border:1px solid #fff;padding: 10px;">
        <div style="margin-bottom: 5px;">1. push & hold "PLAY" button for play attack and play lp1 cycle</div>
        <div style="margin-bottom: 5px;">2. release "PLAY" button for exit from lp1 cycle, play release and play lp2 cycle</div>
        <div>3. push "ESC" for exit from lp2 cycle and sample off</div>
    </div>
</div>