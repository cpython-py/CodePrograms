<?php
$preg = '/\d{3,4}-?\d{7,8}/';
$arr = array('04321235678', '0431-7654321', '12345678');
$preg_arr = preg_grep($preg, $arr);
print_r($preg_arr);

