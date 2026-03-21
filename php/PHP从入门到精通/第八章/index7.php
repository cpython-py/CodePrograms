<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title> 获取复选框的值</title>
</head>

<body>
<form name="form1" method="post" action="index7.php">
    您喜欢的图书类型:
    <input type="checkbox" name="mrbook[]" value="入门类">入门类
    <input type="checkbox" name="mrbook[]" value="案例类">案例类
    <input type="checkbox" name="mrbook[]" value="讲解类">讲解类
    <input type="checkbox" name="mrbook[]" value="实例类">实例类
    <input type="submit" name="submit" value="提交">
</form>
		<?php
		if(isset($_POST['mrbook']) && $_POST['mrbook']!= null){		//判断复选框如果不为空，则执行下面操作
	echo "您选择的结果是：";							//输出字符串
	for($i = 0;$i<count($_POST['mrbook']);$i++)			//通过for循环语句输出选中复选框的值
		echo $_POST['mrbook'][$i]."&nbsp;&nbsp;";		//循环输出用户选择的图书类别
}

		?>
</body>
</html>
