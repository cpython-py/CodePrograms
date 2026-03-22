<?php
function c_back ($str) {
    $str = "<font color = $str[1]>$str[2]</font>";
    return $str;
}

$string = '[color=blue]字体颜色[/color]';
echo preg_replace_callback('/\[color=(.*)\](.*)\[\/color\]/U', "c_back", $string);
