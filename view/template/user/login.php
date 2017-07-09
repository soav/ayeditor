<div align="center" style="padding-top:100px;">
    <div style="display:inline-block;" class="block-border">
        <div class="header header-block">Authorization</div>
        <form action="<?=$this->getHref('user', 'login')?>" method="post">
            <?/*<div>
                <table class="form">
                    <tr>
                        <td>Email:</td>
                        <td><div><input type="text" name="auth[users_email]" /></div></td>
                    </tr><tr>
                        <td>Pass:</td>
                        <td><div><input type="password" name="auth[users_pass]" /></div></td>
                    </tr><tr>
                        <td colspan="2"><div align="center"><button type="submit" class="btn"><b>Login</b></button></div></td>
                    </tr>
                </table>
            </div>
            <div>
                <a href="<?=$this->getHref('user', 'remember')?>">reset password</a>
                /
                <a href="<?=$this->getHref('user', 'register')?>">register</a>
            </div>*/?>
            <div class="oauth-servers">
                <?App::apl()->oauth->renderLogin()?>
            </div>
        </form>
    </div>
</div>