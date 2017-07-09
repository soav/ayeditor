<!DOCTYPE html>
<html lang="ru" class="font-<?=App::apl()->config['params']['FONT_ID']?>">
	<head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title><?=$this->pageTitle?></title>
        <link rel="icon" href="<?=App::apl()->config['app']['appWebRoot']?>/favicon.ico" type="image/x-icon">
        <link rel="shortcut icon" href="<?=App::apl()->config['app']['appWebRoot']?>/favicon.ico" type="image/x-icon">
        <?=$this->renderCss()?>
        <?=$this->renderJs()?>
	</head>
	<body>
        <input id="file-open-dialog"  type="file" style="display:none;" />
        <a id="file-save-dialog" download target="_blank" href="" type=".aym" data-filename="" style="display:none;"></a>
        <div class="top-header">
            <img src="<?=App::apl()->config['app']['appWebRoot']?>/view/img/favicon.png" />
            <span>Y-Studio</span>
            <span>v<?=App::apl()->config['app']['appVersion']?></span>
            <span class="user">
                <?if (App::apl()->user->users_id == 0 ) {?>
                    <a href="<?=$this->getHref('user', 'login')?>">Login</a>
                    <?/*/ <a href="<?=App::apl()->config['app']['appWebRoot']?>/user/register/">Register</a>*/?>
                <?} else {?>
                    Logged as <?=App::apl()->user->getUserName()?>.
                    <a href="<?=$this->getHref('user', 'logout')?>">Logout</a>
                <?}?>
            </span>
        </div>
        <?if (App::apl()->user->users_id != 0) {
            $this->renderPartial('studio/top-menu');
        }?>
        <div class="main">
            <?include $tplFileName;?>
        </div>
    </body>
</html>