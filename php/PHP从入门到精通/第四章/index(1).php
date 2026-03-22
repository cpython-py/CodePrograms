<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>应用foreach语句遍历数组</title>
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
$name = array("1"=>"智能机器人","2"=>"数码相机","3"=>"智能5G手机","4"=>"瑞士手表");
$price = array("1"=>"14998元","2"=>"2588元","3"=>"2666元","4"=>"66698元");
$counts = array("1"=>1,"2"=>1,"3"=>2,"4"=>1);
echo '<table class="lt">
          <tr>
            <td class="STYLE1">商品名称</td>
            <td class="STYLE1">单价</td>
            <td class="STYLE1">数量</td>
            <td class="STYLE1">金额</td>
 </tr>';
foreach($name as $key=>$value){ 		 //以$name数组做循环，输出键和值
     echo '<tr>
            <td class="STYLE2">'.$value.'</td>
            <td class="STYLE2">'.$price[$key].'</td>    
            <td class="STYLE2">'.$counts[$key].'</td>
            <td class="STYLE2">'.$counts[$key]*intval($price[$key]).'元</td>
</tr>';
}
echo '</table>';
?></td>
  </tr>
  <tr>
    <td align="left"></td>
    <td align="left"></td>
    <td align="left"></td>
  </tr>
</table>
</body>
</html>
