<?php
    $i = 'Hello, world!';
    echo <<< std
    这和双引号没什么区别, \$i 同样可以被输出来. <p>
    \$i的内容为: $i
    std;
?>