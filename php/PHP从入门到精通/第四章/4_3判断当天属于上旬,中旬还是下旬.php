<?php
$month = date("n");
$today = date("j");
if ($today >= 1 and $today <= 10) {
    echo "今天是".$month."月".$today."日, 是本月上旬";
} elseif ($today > 10 and $today <= 20) {
    echo "今天是".$month."月".$today."日, 是本月中旬";
} else {
    echo "今天是".$month."月".$today."日, 是本月下旬";
}
?>