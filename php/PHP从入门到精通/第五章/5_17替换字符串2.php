<?php
$content = "白领女子公寓,温馨街南行200米,交通便利,亲情化专人管理,您的理想选择";
$str = "女子公寓";
echo str_ireplace($str, "<span style='color: #FF0000;'>".$str."</span>", $content);
