<?php
function values ($price, $tax=0) {
    $price = $price + ($price * $tax);
    echo "价格:$price<br>";
}

values(100, 0.25);
values(100);
?>