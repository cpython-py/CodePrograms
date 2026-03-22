<?php
$value = "100";
echo "\$value = \"$value\"";
echo "<p>\$value == 100: ";
var_dump($value == 100);
echo "<p>\$value == true";
var_dump($value == true);
echo "<p>\$value != null: ";
var_dump($value != null);
echo "<p>\$value == false: ";
var_dump($value == false);
echo "<p>\$value === 100";
var_dump($value === 100);
echo "<p>\$value === true: ";
var_dump($value === true);
echo "<p>(10/2.0 !== 5): ";
var_dump(10/2.0 !== 5);
?>

// $a === $b, 说明$a和$b不仅数值相等,而且类型也相等
// $a !== $b, 说明$a和$b或者数值不等,或者类型不同
// var_dump() 函数, 作用数值变量的相关信息