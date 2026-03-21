<?php
$a = "程序开发资源库";
echo $a;
echo "<br>";
$b = addcslashes($a, "程序开发资源库");
echo $b;
echo "<br>";
$c = stripslashes($b);
echo $c;
?>

