<form name="form1" method="post" action=index1.php">
    <textarea name="a" cols="20" rows="3" wrap="soft">我使用的是软回车! 我输出后不换行! </textarea>
    <textarea name="b" cols="20" rows="3" wrap="hard">我使用的是硬回车! 输出后自动换行! </textarea>
    <input type="submit" name="Submit" value="提交">
</form>

<?php
if (isset($_POST['Submit']) && $_POST['Submit']!="") {
    echo nl2br($_POST['a'])."<br>";
    echo nl2br($_POST['b']);
}