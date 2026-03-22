<?php
$string = '[b]粗体字[/b]';
$b_rst = preg_replace('/\[b\](.*)\[\/b\]/i', '<b>$1</b>', $string);
echo $b_rst;
