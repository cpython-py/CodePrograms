<?php
echo "di".__LINE__."hang"."<br>";
echo __FILE__."<br>";
echo __DIR__."<br>";

function test() {
    echo __FUNCTION__."<br>";
}
test();

class myclass {
    function func() {
        echo __CLASS__."<br>";
    }
}
$obj = new myclass();
$obj->func();
?>

