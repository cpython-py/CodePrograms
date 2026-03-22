<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>获取单选按钮的值</title>
</head>

<body>
<form action="" method="post" name="form1">
    性别：
    <input name="sex" type="radio" value="男" checked>男
    <input name="sex" type="radio" value="女">女
    <input type="submit" name="Submit" value="提交">
</form>
<?php
if(isset($_POST["sex"]) && $_POST["sex"] != ""){
	echo "您选择的性别为：".$_POST["sex"];
}
?>
</body>
</html>
