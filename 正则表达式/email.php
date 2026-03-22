<?php
$preg = '/^[a-zA-Z0-9_+%]+@[a-zA-Z0-9_+%]+\.[a-zA-Z0-9_+%]+$/';
$arr[0] =  "zero888_666@qq.com";
$res = preg_grep($preg, $arr);
print_r($res);
$pattern = '/^<\/?[a-zA-Z][a-zA-Z0-9]*\s*([^>]*?)\/?>$/';