<?php
$num = 1;
$str = "10以内的偶数为: ";
while ($num <= 10) {
    if ($num % 2 == 0) {
        $str .= $num." ";
    }
    $num++;
}

echo $str;
?>