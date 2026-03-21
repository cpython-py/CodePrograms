<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>综合运用数组函数，更新数组中的元素值</title>
</head>
<style type="text/css">
<!--
.STYLE1 {font-size: 13px;
    font-weight: bold;
    width: 145px;
    height: 30px;
    text-align: center;
    background-color: #FFFFFF;
}
.STYLE2 {font-size: 12px;
    height: 25px;
    text-align: center;
    background-color: #FFFFFF;

}
.lt{
    width: 580px;
    background-color: #c17e50;
    border-collapse: collapse;
}
.lt td{
    border: 1px solid #c17e50;
}
-->
</style>
<body>
<table width="859" height="381" border="0" cellpadding="0" cellspacing="0" background="images/bf.jpg">
  <tr>
    <td width="225" height="100">&nbsp;</td>
    <td width="624">&nbsp;</td>
    <td width="10">&nbsp;</td>
  </tr>
  <tr>
    <td height="230"></td>
    <td align="center">
<?php
$name = "智能机器人@数码相机@智能5G手机@瑞士手表";		//定义字符串
$price ="14998@2588@2666@66698";
$counts = "1@2@3@4";
$arrayid=explode("@",$name);				//将商品名称的字符串转换到数组中
$arraynum=explode("@",$price);				//将商品价格的字符串转换到数组中
$arraycount=explode("@",$counts);			//将商品数量的字符串转换到数组中
if(isset($_POST['Submit']) && $_POST['Submit']==true){
	$id=$_POST['name'];							//获取要更改的元素名称
	$num=$_POST['counts'];						//获取更改的值
	$key=array_search($id,$arrayid);   			//在数组中搜索给定的值，如果成功返回键名 
	$arraycount[$key]=$num;						//更改商品数量
	$counts=implode("@",$arraycount);			//将更改后的商品数量添加到购物车中
}
?>
        <table class="lt">
            <tr>
                <td class="STYLE1">商品名称</td>
                <td class="STYLE1">单价</td>
                <td class="STYLE1">数量</td>
                <td class="STYLE1">金额</td>
            </tr>
 
<?php
for($i=0;$i<count($arrayid);$i++){ 		 //for循环读取数组中的数据
?>
<form name="form1_<?php echo $i;?>" method="post" action="index2.php">
   <tr>
       <td class="STYLE2"><?php echo $arrayid[$i]; ?></td>
       <td class="STYLE2"><?php echo $arraynum[$i]; ?></td>
       <td class="STYLE2">
         <input name="counts" type="text" id="counts" value="<?php echo $arraycount[$i]; ?>" size="8">
         <input name="name" type="hidden" id="name" value="<?php echo $arrayid[$i]; ?>">
         <input type="submit" name="Submit" value="更改"></td>
       <td class="STYLE2"><?php echo $arraycount[$i]*$arraynum[$i]; ?></td>
</tr>
</form>
<?php
}
?>

</table>
</td>
  </tr>
  <tr>
    <td align="left"></td>
    <td align="left"></td>
    <td align="left"></td>
  </tr>
</table>
</body>
</html>
