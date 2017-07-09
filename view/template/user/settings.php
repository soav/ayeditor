<form action="<?=$this->getHref('user', 'settings')?>" method="post">
<div class="header header-block">Colors</div>
<input type="hidden" name="settings[user_settings][colorShemeId]" value="<?=App::apl()->user->getSettingsValue('colorShemeId')?>" />
<div class="block-content">
    <div class="block-container">
        <div class="block-wrap selector">
            <?foreach ($color_shemes as $cs) {
                $userName = isset($users[$cs->users_id]) ? $users[$cs->users_id]->users_nickname : 'Default';
                if (empty($userName)) {
                    $userName = 'NoNickName#' . $cs->users_id;
                }
                ?>
                <div class="selector-item color-schemes<?=$cs->color_shemes_id==App::apl()->user->getSettingsValue('colorShemeId') ? ' selected' : ''?>" data-shemes-id="<?=$cs->color_shemes_id?>" data-can-modify="<?=(int)($cs->users_id == App::apl()->user->users_id)?>" data-shemes-name="<?=$cs->color_shemes_name?>"><?=$userName?> - <?=$cs->color_shemes_name?></div>
            <?}?>
        </div>
    </div>
    <div style="float:left;padding-left:10px">
        <?$canModify = $color_shemes[App::apl()->user->getSettingsValue('colorShemeId')]->users_id == App::apl()->user->users_id;?>
        <div class="warning-text" id="color-cant-modify" <?=$canModify ? 'style="display:none;"' : ''?>><b>You can`t modify this color scheme. But you can copy and modify this color sheme. <a class="btn" id="copy-solor-sheme">COPY</a></b></div>
        <div>
            <table class="form">
                <tr>
                    <td>color sheme name</td>
                    <td><div><input type="text" name="settings[color_shemes][color_shemes_name]" value="<?=$color_shemes[App::apl()->user->getSettingsValue('colorShemeId')]->color_shemes_name?>" <?=$cs->color_shemes_id!=App::apl()->user->getSettingsValue('colorShemeId') ? 'disabled="disabled"' : ''?>/></div></td>
                </tr>
                <? foreach ($color_shemes_groups as $csg) {?>
                    <tr><td colspan="2"><div class="header header-block"><?=$csg->color_shemes_groups_name?></div></td></tr>
                    <?foreach ($color_shemes_keys[$csg->color_shemes_groups_id] as $csk) {
                        $colorValue = isset($color_shemes_colors[$csk->color_shemes_keys_id]) ? $color_shemes_colors[$csk->color_shemes_keys_id] : $csk->color_shemes_default_value;?>
                        <tr>
                            <td><?=$csk->color_shemes_keys_name?></td>
                            <td>
                                <div class="color-picker color-<?=$csk->color_shemes_keys_id?>" style="background-color:#<?=$colorValue?>;display:inline-block;">
                                    <input type="hidden" name="settings[colors][<?=$csk->color_shemes_keys_id?>]" value="<?=$colorValue?>" />
                                </div>
                                <?=!isset($color_shemes_colors[$csk->color_shemes_keys_id]) ? '<div class="warning-text" style="display:inline-block;" title="missing in current color sheme">[!]<div>' : ''?>
                            </td>
                        </tr>
                    <?}?>
                <?}?>
            </table>
        </div>
    </div>
    <div class="clearfix"></div>
</div>
<div>
    <button type="submit" class="btn">Save settings</button>
</div>
</form>