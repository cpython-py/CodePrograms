# PyInputPlus库
## 常用函数
* inputStr() \
类似于内置的input()函数,但具有一般的PyInputPlus功能,你还可以将自定义验证函数传递给它
* inputNum() \
确保用户输入数字并返回int或float值,这取决于数字是否包含小数点
* inputChoice() \
确保用户输入系统提供的选项之一
* inputMenu() \
与inputChoice()类似,但提供一个带有数字或字母选项的菜单
* inputDatetime() \
确保用户输入日期和时间
* inputYesNo() \
确保用户输入"yes"或"no"响应
* inputBool() \
与inputYesNo()类似,但接受"True"或"False"响应,并返回一个bool值
* inputEmail() \
确保用户输入有效的E-mail地址
* inputFilepath() \
确保用户输入有效的文件路径和文件名,并可以选择检查是否存在具有该名称的文件
* inputPassword()类似于内置的input(),但是在用户输入时显示*字符,因此不会在屏幕上显示口令或其他敏感信息
***

## 关键字参数
inputNum(), inputInt(), inputFloat()具有min, max, lessThan, greaterThan等关键字参数 \
min:输入的数的最小值 \
max:输入的数的最大值 \
lessThan:输入的数必须小于lessThan \
greaterThan:输入的数必须大于greaterThan 

### 关键字参数 blank
默认blank=False,即不能输入空格,除非设置blank=True
### 关键字参数 limit
limit的作用是限制用户输入有效内容的次数,如果输入次数等于limit的值会报错