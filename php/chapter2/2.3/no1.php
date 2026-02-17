<?php
// 1/8.字符串
$x = "Hello world!";
var_dump($x);
echo "<br>";
$x = 'Hello world!';
var_dump($x);
echo "<br>";

// 2/8.整形
$x = 5985;
var_dump($x);
echo "<br>";
$x = -345; //负数
var_dump($x);
echo "<br>";
$x = 0x8C; //十六进制数
var_dump($x);
echo "<br>";
$x = 047; //八进制数
var_dump($x);
echo "<br>";

// 3/8.浮点数
$x = 10.365;
var_dump($x);
echo "<br>";
$x = 2.4e3; //科学计数法
var_dump($x);
echo "<br>";
$x = 8E-5; //科学计数法
var_dump($x);
echo "<br>";

// 4/8.布尔值
$x = true;
$y = false;
var_dump($x, $y);
echo "<br>";

// 5/8.数组
$cars = array("Volvo", "BMW", "Toyota");
var_dump($cars);
echo "<br>";

// 6/8.对象
class Car
{
    function what_color($color) {
        return $color;
    }
}

$color = new Car();
echo $color->what_color("red");
echo "<br>";

// 7/8.NULL
$x = "Hello world!";
$x = null;
var_dump($x);
echo "<br>";

// 8/8.资源
// ......

// PHP 类型比较
header("Content-Type: text/html; charset=UTF-8"); //保持中文不乱码
if (42 == "42") {
    echo '1.值相等';
    echo "<br>";
}
if (42 === "42") {
    echo '2.类型相等';
    echo "<br>";
}
else {
    echo '3.类型不相等';
    echo "<br>";
}
?>   