<div class="layout-container layout-tracker selected">
    <?$this->renderPartial('studio/tracker');?>
</div>
<div class="layout-container layout-sampler">
    <?$this->renderPartial('studio/sampler');?>
</div>

<div class="clearfix"></div>
<div class="analysers">
    <div class="block-container">
        <div class="block-border">
            <div class="block-wrap">
                <canvas id="analyser-vol" style="width:60px; height:60px;"></canvas>
            </div>
        </div>
    </div>
    <div class="block-container">
        <div class="block-border">
            <div class="block-wrap">
                <canvas id="analyser-form" width="512px" height="80px"></canvas>
            </div>
        </div>
    </div>
    <div class="block-container">
        <div class="block-border">
            <div class="block-wrap">
                <canvas id="analyser-frq" style="width:512px; height:60px;"></canvas>
            </div>
        </div>
    </div>
</div>