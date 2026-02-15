# PHP: static 关键字
```php
<?php
function myTest() {
    static $x = 0;
    echo $x;
    echo $x++;
}

function myTest_3_times() {
    myTest();
    myTest();
    myTest();
}

myTest_3_times();
?>
```
然后每次调用该函数时,该变量将会保留着函数前一次被调用的值. \
** 注释: ** 该变量仍然是函数的局部变量.