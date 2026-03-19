<?php
$i = true;
$j = true;
$z = false;
if ($i or $j and $z)
    echo "true";
else
    echo "false";
echo "<br>";
if ($i || $j and $z)
    echo "true";
else
    echo "false";
?>

// && 逻辑与
// || 逻辑或
// xor 逻辑异或
// ! 逻辑非