<?php
$str1 = "明日程序开发资源库!";
$str2 = "明日程序开发资源库!";
$str3 = "mrsoft";
$str4 = "MRSOFT";
// stramp() 区分大小写
echo strcmp($str1, $str2);
// stramp()和strcaseamp()对字符串按字节进行比较
echo strcmp($str3, $str4);
// strcasecmp()不区分大小写
echo strcasecmp($str3, $str4);
