<?php
// 先使用addslashes()进行转义,在使用stripslashes进行还原
$str = "select * from tb_book where bookname = 'PHP从入门到精通'";
echo $str."<br>";
$a = addslashes($str);
echo $a."<br>";
$b = stripslashes($a);
echo $b."<br>";
?>
