<?php
session_start();
if(isset($_POST['user']) && isset($_POST['pwd'])){
    //判断输入的用户名和密码是否正确
    if($_POST['user'] == 'admin' && $_POST['pwd'] == '123456' || $_POST['user'] == 'test' && $_POST['pwd'] == '000000'){
        $_SESSION['user']=$_POST['user'];//使用Session存储用户名
        $_SESSION['pwd']=$_POST['pwd'];//使用Session存储密码
    }else{
        echo "<script>alert('您输入的用户名或密码不正确！');history.back();</script>";
        exit;
    }
}
if($_SESSION['user']==""){
  echo "<script>alert('请通过正确的途径登录本系统！');history.back();</script>";
}
?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="../CSS/style.css" rel="stylesheet">
<title>通过SESSION判断用户的操作权限</title>
<style type="text/css">
<!--
.style1 {color: #FF0000}
*{ font-size:12px;}
-->
</style>
</head>
<body >

<TABLE width="856" height="498" align="center" cellPadding=0 cellSpacing=0> 
    <TR> 
      <TD height="258" valign="baseline" style="BACKGROUND-IMAGE: url(images/bg.jpg); VERTICAL-ALIGN: middle; HEIGHT: 50px; TEXT-ALIGN: center"><TABLE width="856" height="419" cellPadding=0 cellSpacing=0 >
          <TR>
            <TD height="176" colspan="6" 
          style="VERTICAL-ALIGN: text-top; WIDTH: 80px; HEIGHT: 115px; TEXT-ALIGN: right"></TD>
          </TR>
          <TR>
            <TD height="214" align="center" valign="top">
              <TABLE  align="center" cellPadding=0 cellSpacing=0 >
                  <TR align="center" valign="middle">
                    <TD  style="WIDTH: 140px; COLOR: red;">当前用户:&nbsp;<?php if($_SESSION['user']=="admin" && $_SESSION['pwd']=="123456"){echo "管理员";}else{echo "普通用户";}?>&nbsp;&nbsp;</TD>
                    <TD width="70"><a href="#">博客首页</a></TD>
                    <TD width="70">|&nbsp;<a href="#">我的文章</a></TD>
                    <TD width="70">|&nbsp;<a href="#">我的相册</a></TD>
                    <TD width="70">|&nbsp;<a href="#">音乐在线</a></TD>
                    <TD width="70">|&nbsp;<a href="#">修改密码</a></TD>
                    <?php
					  if($_SESSION['user']=="admin" && $_SESSION['pwd']=="123456"){
					?>
                    <TD width="70">|&nbsp;<a href="#">用户管理</a></TD>
                    <?php  
					  }
					?>
                </TR>
            </TABLE>
              <br>
              <br>
 明日学院是吉林省明日科技有限公司研发的在线教育平台。<br>
 <br>
 <br> <br>
                该平台面向学习者提供大量优质视频教程。 <br>
</TD>
          </TR>
      </TABLE>
      欢迎访问博客网&nbsp;<a href="safe.php">注销用户</a></TD>
    </TR> 
</TABLE> 
</body>
</html>
