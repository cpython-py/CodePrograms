<?php
define("MESSAGE", "我是一名php程序员");
echo MESSAGE."<br>";
define("COUNT", "我想要怒放的生命");
$name = "COUNT";
echo constant($name)."<br>";
// echo Message;
?>

// define() 函数,用于定义常量, 第一个参数是常量的名字(string), 后面是常量的值;
// constant() 函数, 用于输出常量名,优点是可以动态的输出常量;
// defined() 函数, 判断一个常量是否已经被定义;