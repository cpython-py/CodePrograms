<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>获取上传文件的名称</title>
</head>

<body>
<form name="form1" method="post" action="index10.php">
<input type="file" name="file" size="15" >
<input type="submit" name="upload" value="上传" >
</form>
<?php
if(isset($_POST['file']) && $_POST['file']!=""){
	echo $_POST['file'];							//输出要上传文件的名称
}
?>
</body>
</html>
