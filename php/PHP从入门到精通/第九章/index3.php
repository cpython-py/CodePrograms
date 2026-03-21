<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>switch分支语句的应用</title>
</head>
<script type="text/javascript">
function check(books){
switch(books){		
	case "生活类":			
		alert("您最喜爱的图书类别是："+books);
		break;
	case "电脑类":						
		alert("您最喜爱的图书类别是："+books);
		break;			
	case "科技类":						
		alert("您最喜爱的图书类别是："+books);
		break;									
	case "体育类":							
		alert("您最喜爱的图书类别是："+books);
		break;			
	}
}

</script>
<body>
<form name="form1" method="post" action="">
    <span class="style2">您最喜爱的图书类别：</span>  
    <input  name="book" type="radio" value="生活类" onclick="check(this.value);" >
  生活类
  <input  name="book" type="radio"value="电脑类" onclick="check(this.value);">
    电脑类
    <input name="book" type="radio" value="科技类" onclick="check(this.value);">
  科技类
<input  name="book" type="radio"value="体育类" onclick="check(this.value);">
    体育类  
</form>
</body>
</html>
