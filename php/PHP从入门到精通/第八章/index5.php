<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>获取文本框的信息</title>
</head>

<body>
<form name="form1" method="post" action="">
    用户名：<input type="text" name="user" size="20" >
    密&nbsp;&nbsp;码：<input name="pwd" type="password" id="pwd" size="20">
    <input name="submit" type="submit" id="submit" value="登录" />
</form>

<?php
if(isset($_POST["submit"]) && $_POST["submit"]=="登录"){
	echo "<br>您输入的用户名为：".$_POST['user']."&nbsp;&nbsp;密码为：".$_POST['pwd'];
}
?>
</body>
</html>
