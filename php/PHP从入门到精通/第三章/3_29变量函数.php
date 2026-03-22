<?php
function come () {
    echo "来了<p>";
}

function go ($name = "jack") {
    echo $name."走了<p>";
}

function back($string) {
    echo "又回来了, $string<p>";
}

$func = "come";
$func ();
$func = "go";
$func ("Tom");
$func = "back";
$func ("Lily");
?>