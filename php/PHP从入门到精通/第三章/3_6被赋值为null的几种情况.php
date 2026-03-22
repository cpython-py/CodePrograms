<?php
echo "变量(\$string1)直接赋值为null: ";
$string1 = null;
$string3 = "str";
if (!isset($string1))
    echo "string1 = null";
echo "<p>变量(\$string2)未被赋值: ";
if (!isset($string2))
    echo "string2 = null";
echo "<p>被unset()函数处理过的变量(\$string3):";
unset($string3);
if (!isset($string3))
    echo "string3 = null";
?>

// isset() 函数, 用于判断变量是否为null,返回一个boolean型,如果变量为null,则返回true, 否则返回false
// unset() 函数, 用于销毁指定的变量
