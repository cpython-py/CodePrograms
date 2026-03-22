<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>获取菜单列表框的值</title>
</head>
<body>
<form name="form1" method="post" action="index9.php">
    请选择您喜欢的PHP类图书：<p>
    <select name="select[]" size="5" multiple>
        <option value="PHP数据库系统开发完全手册">PHP数据库系统开发完全手册</option>
        <option value="PHP编程宝典">PHP编程宝典</option>
        <option value="PHP程序开发范例宝典">PHP程序开发范例宝典</option>
        <option value="PHP从入门到精通">PHP从入门到精通</option>
        <option value="PHP函数参考大全">PHP函数参考大全</option>
    </select>
    <input type="submit" name="Submit" value="提交">
</form>
<?php
if (isset($_POST['select']) && $_POST['select'] != "") {
    echo "<p>您的选择是：";
    for ($i = 0; $i < count($_POST['select']); $i++)
        echo $_POST['select'][$i]."&nbsp;&nbsp";		//循环输出多选列表框的值
}
?>
</body>
</html>
