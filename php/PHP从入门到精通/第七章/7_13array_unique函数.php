<?php
$array_push = array("PHP从入门到精通", "PHP范例手册", "PHP范例手册", "PHP网络编程自学手册");
array_push($array_push, "PHP开发典型模块大全", "PHP网络编程自学手册");
print_r($array_push);
echo "<br>";
$result = array_unique($array_push);
print_r($result);
