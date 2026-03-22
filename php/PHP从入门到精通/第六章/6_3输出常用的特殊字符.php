<?php
$str = '!,$,^,*,+,.,[,],\\,/,b,<,>';
$str2 = 'b';
$match_one = preg_quote($str, $str2);
echo $match_one;
