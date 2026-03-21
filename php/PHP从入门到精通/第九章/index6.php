<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>break语句的应用</title>
</head>
<body>
<script type="text/javascript">
for( i=0;i<20;i++ ){							 //在for语句中初始化循环变量，定义循环条件，定义每次循环后变量i的值累加1
	if(i>10){
		break;  								 //如果i>10就会立即跳出循环
	}
	document.write(i+"-");						 //输出i的值
}
</script>
</body>
</html>
