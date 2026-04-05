<?php
$nextWeek = time() + (7 * 24 * 60 * 60);
echo 'Now: '.date('Y-m-d')."<p>";
echo 'Next Week: '.date('Y-m-d', $nextWeek);

