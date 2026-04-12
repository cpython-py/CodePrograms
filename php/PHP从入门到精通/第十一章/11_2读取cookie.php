<?php
date_default_timezone_set("Asia/Shanghai");
if (!isset($_COOKIE['visitime'])) {
    setcookie("visitime", date("Y-m-d H:i:s"));
    echo "欢迎您第一次访问网站!";
} else {
    setcookie("visitime", date("Y-m-d H:i:s"), time()+60);
    echo "您上次访问的时间为: ".$_COOKIE['visitime'];
    echo "<br>";
}
echo "您本次访问网站的时间为: ".date("Y-m-d H:i:s");

