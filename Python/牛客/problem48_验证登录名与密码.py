class Problem48:
    def __init__(self):
        self.problem_48()
    
    def problem_48(self):
        admin = ['admis', 'Nowcoder666']
        username = input()
        pwd = input()
        
        if username and pwd in admin:
            print("登录成功")
        else:
            print("登录失败")
    
if __name__ == "__main__":
    Problem48()