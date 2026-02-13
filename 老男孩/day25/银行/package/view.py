import time


class View():

    def login():
        name = input("请输入管理员的账户:")
        pwd = input("请输入管理员的密码:")
        
        if name == "admin" and pwd == "111":         
            # 调用方法welcome()          
            View.welcome()
            
            time.sleep(1)
            
            # 调用方法operation()
            View.operation()
            
            return True

        else:
            print("您的用户密码有错误!")

    @staticmethod
    def welcome():
        print("""
***********************************************
*                                             *
*       Welcome to OldMan Bank                *
*                                             *
***********************************************
              """)

    @staticmethod
    def operation():
        strvar = ("""
***********************************************
*   开户(1) 查询(2) 存钱(3) 取钱(4) 转账(5)     *
*                                             *
*   改密(6) 锁卡(7) 解卡(8) 补卡(9) 退出(0)     *
***********************************************
                  """)
        print(strvar)


if __name__ == "__main__":
    View.login()
