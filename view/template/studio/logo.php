<div style="text-align:center;padding:100px 0px 50px 0px;">
    <img src="<?=App::apl()->config['app']['appWebRoot']?>/media/images/logo.png" />
</div>
<?if (App::apl()->user->users_id == 0) {?>
    <div style="text-align:center;">
        <div align="left" style="display:inline-block;">
            <div>1. Login or register</div>
            <div>2. Create a new or open an existing module</div>
            <div>3. Enjoy</div>
        </div>
    </div>
<?}?>