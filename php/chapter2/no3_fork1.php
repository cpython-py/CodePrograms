<?php
// title: global关键字
$x = 5;
$y = 10;

function myTest()
{
    $GLOBALS['y'] = $GLOBALS['x'] + $GLOBALS['y'];
}

myTest();
echo $y;
?>