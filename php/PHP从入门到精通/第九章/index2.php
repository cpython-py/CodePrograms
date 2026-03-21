<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>判断指定的年份是否为闰年</title>
</head>
<script type="text/javascript">
function check(){ 
var year=form1.year.value;
//如果变量year能够被4整除，同时不能被100整除，或者能被400整除，则执行下面的语句
	if((year%4)==0 && (year%100)!=0 || (year%400)==0){
		alert(year+"年是闰年！");			//如果year变量满足条件，则输出此年份为闰年
	}
}
</script>
<body>
<form name="form1" method="post" action="">
    <span class="style2">检测闰年：</span>  
    <select name="year">
    <?php for($i=2020;$i<=2030;$i++){ ?>
    <option value="<?php echo $i;?>"><?php echo $i;?>年</option>
    <?php } ?>
  </select>
  <input type="submit" name="Submit" value="检测" onclick="check();">
</form>
</body>
</html>
