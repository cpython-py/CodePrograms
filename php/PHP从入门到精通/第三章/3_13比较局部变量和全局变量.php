<?php
$example = "在......函数外";
function example () {
    $example = "......在函数内......";
    echo "在函数内输出的内容是: $example.<br>";
}
example();
echo "在函数外输出的内容是: $example.<br>";
?>