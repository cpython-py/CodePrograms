<?php
$hr = "黄蓉";
function lxt () {
    $gj = "郭静";
    echo $gj."<br>";
    global $hr;
    echo $hr."<br>";
}

lxt();
?>