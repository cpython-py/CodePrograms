<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>在普通的Web页中插入表单</title>
<style type="text/css">
<!--
body,td,th {
	font-size: 12px;
}
-->
</style></head>
<body>
<form action="index.php" method="post" name="form1" enctype="multipart/form-data">
  <table width="405" height="24" border="1" cellpadding="1" cellspacing="1" bordercolor="#FFFFFF" bgcolor="#999999">
    <tr bgcolor="#FFCC33">
      <td width="103" height="25" align="right">姓名：</td>
      <td width="144" height="25" align="left"><input name="user" type="text" id="user" size="20" maxlength="100"></td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td height="25" align="right">性别：</td>
      <td height="25" colspan="2" align="left"><input name="sex" type="radio" value="男" checked>
        男
        <input type="radio" name="sex" value="女">
        女</td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td width="103" height="25" align="right">密码：</td>
      <td width="289" height="25" colspan="2" align="left"><input name="pwd" type="password" id="pwd" size="20" maxlength="100"></td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td height="25" align="right">学历：</td>
      <td height="25" colspan="2" align="left"><select name="select">
          <option value="初中">初中</option>
          <option value="高中">高中</option>
          <option value="专科">专科</option>
          <option value="本科" selected>本科</option>
          <option value="研究生">研究生</option>
          <option value="博士生">博士生</option>
          <option value="硕士生">硕士生</option>
        </select></td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td height="25" align="right">爱好：</td>
      <td height="25" colspan="2" align="left"><input name="fond[]" type="checkbox" id="fond[]" value="电脑">
        电脑
        <input name="fond[]" type="checkbox" id="fond[]" value="音乐">
        音乐
        <input name="fond[]" type="checkbox" id="fond[]" value="旅游">
        旅游
        <input name="fond[]" type="checkbox" id="fond[]" value="其他">
        其他</td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td height="25" align="right">个人写真： </td>
      <td height="25" colspan="2" align="left"><input name="photo" type="file" size="20" maxlength="1000" id="photo"></td>
    </tr>
    <tr bgcolor="#FFCC33">
      <td height="25" align="right">个人简介： </td>
      <td height="25" colspan="2" align="left"><textarea name="intro" cols="28" rows="3" id="intro"></textarea></td>
    </tr>
    <tr align="center" bgcolor="#FFCC33">
      <td height="25" colspan="3"><input type="submit" name="submit" value="提交">
        &nbsp;&nbsp;
        <input type="reset" name="submit2" value="重置"></td>
    </tr>
  </table>
</form>
</body>
</html>
