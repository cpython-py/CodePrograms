<?php
function values ($price, $weight=0.45) {
    $price = $price + ($price * $weight);
    return $price;
}

echo values (100);
?>