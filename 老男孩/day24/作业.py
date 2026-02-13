user_info = {"user1": "password1"}
logged_in_user = None


def authentication(func):
    def wrapper():
        global logged_in_user
        if logged_in_user:
            print(f"用户 {logged_in_user} 已登录，直接执行函数")
            return func()
        username = input("请输入用户名: ")
        password = input("请输入密码: ")
        if username in user_info and user_info[username] == password:
            logged_in_user = username
            print("登录成功")
            return func()
        print("用户名或密码错误")
    return wrapper


@authentication
def function1():
    print("这是函数1")


@authentication
def function2():
    print("这是函数2")


function1()
function2()
