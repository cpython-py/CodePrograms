<?php
header("Content-Type: text/html; charset=UTF-8"); // 保持中文不乱码
// 区分大小写的常量名
define("GREETING", "欢迎访问 mashibing.com!");
echo GREETING; // 输出 "欢迎访问 mashibing.com!"
echo '<br>';

function myTest() {
    echo GREETING;
    echo '<br>';
}

