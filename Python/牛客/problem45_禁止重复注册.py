# 创建一个依次包含字符串'Niuniu'、'Niumei'、'GURR'和'LOLO'的列表 current_users，再创建一个依次包含字符串'GurR'、'Niu Ke Le'、'LoLo'和'Tuo Rui Chi'的列表 new_users，使用 for 循环遍历 new_users，如果遍历到的新用户名在 current_users 中，则使用 print()语句一行输出类似字符串'The user name GurR has already been registered! Please change it and try again!'的语句，否则使用 print()语句一行输出类似字符串'Congratulations, the user name Niu Ke Le is available!'的语句。（注：用户名的比较不区分大小写）

# 输入描述：

# 无

# 输出描述：

# 按题目描述进行输出即可。
# The user name GurR has already been registered! Please change it and try again!
# Congratulations, the user name Niu Ke Le is available!
# The user name LoLo has already been registered! Please change it and try again!
# Congratulations, the user name Tuo Rui Chi is available!
class Problem45:
    def __init__(self):
        self.problem_45()
    
    def problem_45(self):
        currents_users = ['Niuniu', 'Niumei', 'GURR', 'LOLO']
        new_users = ['GurR', 'Niu Ke Le', 'LoLo', 'Tuo Rui Chi']
        
        currents_users_lower = [i.lower() for i in currents_users]       
        for i in new_users:                
            if i.lower() in currents_users_lower:
                print(f"The user name {i} has already been registered! Please change it and try again!")
                continue
            else:
                print(f"Congratulations, the user name {i} is available!")


if __name__ == '__main__':
    Problem45()