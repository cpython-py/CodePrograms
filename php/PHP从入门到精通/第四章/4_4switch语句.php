<?php
switch (isset($_GET['lmbs'])?$_GET['lmbs']:"") {
    case "最新商品";
        include "new.php";
        break;
    case "热门商品";
        include "jollifcation.php";
        break;
    case "推荐商品";
        include "commend.php";
        break;
    case "我的购物车";
        include "shopping_cart.php";
        break;
}
?>
<map name="Map" id="Map">
    <area shape="rect" coords="9,92,65,113" href="#">
    
</map>