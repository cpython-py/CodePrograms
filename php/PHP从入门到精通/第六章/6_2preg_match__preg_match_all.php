<?php
$str = "This is an example!";
$preg = '/\b\w{2}\b/';
$num1 = preg_match($preg, $str, $str1);
echo $num1.'<br>';
print_r($str1);
$num2 = preg_match_all($preg, $str, $str2);
echo '<p>'.$num2.'<br>';
print_r($str2);