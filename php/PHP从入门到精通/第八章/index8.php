<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>获取下拉列表框的值</title>
</head>

<body>
<form name="form1" method="post" action="">
    意见主题：
    <select name="select" size="1">
        <option value="公司发展" selected>公司发展</option>
        <option value="管理制度">管理制度</option>
        <option value="后勤服务">后勤服务</option>
        <option value="员工薪资">员工薪资</option>
    </select>
    <input type="submit" name="submit" value="提交">
</form>
<?php
if(isset($_POST['submit']) && $_POST['submit']=="提交"){
   echo "您选择的意见主题为：".$_POST['select'];
}
?>
</body>
</html>
