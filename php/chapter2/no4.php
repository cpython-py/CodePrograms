<?php
function myTest()
{
    static $x = 0;
    echo $x;
    $x++;
    echo PHP_EOL;
    echo $x;
}

myTest();
myTest();
myTest();
?>