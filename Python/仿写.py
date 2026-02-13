def register():
    users = {}
    attempts = 3

    while attempts > 0:
        username = input("请输入用户名:")
        passwd = input("请输入密码:")
        passwd_repeat = input("请再次输入密码:")

        if passwd != passwd_repeat:
            attempts -= 1
            print("两次输入的密码不一致,请重新输入!")
            if attempts == 0:
                print("机会用完了,请下次再来!")

        elif passwd == passwd_repeat:
            print("登录成功!")
            users[username] = passwd
            return users

    return users


username_dic = register()
print(username_dic)
