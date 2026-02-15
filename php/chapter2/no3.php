<?php
// title: global关键字
$x = 5;
$y = 10;

function myTest()
{
    global $x, $y;
    $y = $x + $y;
    echo $y;
}

myTest();
?>