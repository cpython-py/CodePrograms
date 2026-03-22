<?php
// 1.判断输入的数据是否符合要求
$prompt = "3333333333333333333333333333333333333333333333333333333333333";
if ($prompt == false)
    echo "输入的内容不能为空!";
if (strlen($prompt) > 25)
    echo "输入的长度不能超过25!";

// 2.获取计算机信息 
echo "<br>";
echo $_SERVER['REMOTE_ADDR'];
echo "<br>";
echo $_SERVER['REMOTE_PORT'];
echo "<br>";
echo $_SERVER['REMOTE_HOST'];
echo "<br>";
echo $_SERVER['SERVER_ADDR'];
echo "<br>";

// 3.使用多种输出语句输出数据
echo "hello";
echo "<br>";
print "hello";

printf("hello");

print_r("hello");
?>