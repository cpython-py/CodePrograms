# 注册函数
def register():
    users = {}
    attempts = 3
    
    while attempts > 0:
        username = input("请输入用户名:")
        passwd = input("请输入密码:")
        passwd_repeat = input("请确认密码:")
        
        if passwd_repeat != passwd:
            attempts -= 1
            print(f"两次密码不一致,请重新输入,您还有{attempts}次机会")
            
            if attempts == 0:
                print("您没有机会了")
        elif passwd == passwd_repeat:
            print("注册成功!")
            users[username] = passwd
            return users
    
    return users


username_dic = register()
print(username_dic)
