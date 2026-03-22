<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>continue语句的应用</title>
</head>

<body>
<script type="text/javascript">
	var str="20以内的偶数有：";		//定义变量str
	var i=1;							//定义变量i
	while(i<20){						//应用while语句，定义循环条件为i<10
	   if(i%2!=0){					    //如果变量i能被2整除，则执行下面的语句
			i++;				    	//在退出本次循环之前使变量i的值累加1，如果缺少该语句将导致死循环
			continue;					//调用continue语句
		}
		str=str+i+" ";					//拼接字符串str，以获取变量i的值
		i++;							//使变量i的值累加1，此语句不可缺少
	}
	document.write(str);				//输出变量str的值
</script>
</body>
</html>
