<?php
function example ($m) {
    $m = $m * 5 + 10;
    echo "在函数内: \$m = ".$m;
}

$m = 1;
example($m);
echo "<p>在函数外: \$m = $m <p>";
?>