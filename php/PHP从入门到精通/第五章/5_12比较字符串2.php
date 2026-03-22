<?php
$str1 = "str2.jpg";
$str2 = "str10.jpg";
$str3 = "mrsoft1";
$str4 = "MRSOFT2";
echo strcmp($str1, $str2);
echo " ";
echo strcmp($str3, $str4);
echo " ";
echo strnatcmp($str1, $str2);
echo " ";
echo strnatcmp($str3, $str4);
