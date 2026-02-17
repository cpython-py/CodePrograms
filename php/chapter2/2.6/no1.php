<?php
$x = 10;
$y = 6;
echo ($x+$y); //输出16
echo '<br>'; //换行
echo ($x-$y); //输出4
echo '<br>'; //换行
echo ($x*$y); //输出60
echo '<br>'; //换行
echo ($x/$y); //输出1.6666666666667
echo '<br>';  //换行
echo ($x%$y); //输出4
echo '<br>';  //换行

$x = 10;
echo $x."</br>"; //输出10
$y = 20;
$y += 100;
echo $y."</br>";  //输出120
$z = 50;
$z -= 25;
echo $z."</br>";  //输出25
$i = 5;
$i *= 6;
echo $i."</br>";  //输出30
$j = 10;
$j /= 5;
echo $j."</br>"; //输出6
$k = 15;
$k %= 4;
echo $k."</br>"; //输出3

$a = "Hello";
$b = $a." world!";
echo $b; //输出Hello world!
$x = "Hello";
$x .= " world!";
echo $x; //输出Hello world!

$x = 10;
echo ++$x; //输出11
$y = 10;
echo $y--; //输出10
$z = 5;
echo --$z; //输出4
$i = 5;
echo $i--; //输出5
