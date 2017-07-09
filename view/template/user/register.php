<div class="header">Registration</div>
<form action="<?=$this->getHref('user', 'login')?>" method="post">
	<div><input type="text" name="register[users_email]" /></div>
    <div><input type="password" name="register[users_email]" /></div>
	<div><input type="password" name="register[users_pass]" /></div>
	<div><button type="submit" class="button">Login</button></div>
	<div>
		<a href="<?=$this->getHref('user', 'remember')?>">reset password</a>
		/
		<a href="<?=$this->getHref('user', 'register')?>">register</a>
	</div>
	<div class="oauth-servers">
		<?App::apl()->oauth->renderLogin()?>
	</div>
</form>
