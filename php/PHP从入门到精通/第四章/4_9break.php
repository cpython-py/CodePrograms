<?php
while (true) {
    $tmp = rand(1, 20);
    echo $tmp." ";
    if ($tmp == 10) {
        echo "<p>变量等于10终止循环";
        break;
    }
}
?>