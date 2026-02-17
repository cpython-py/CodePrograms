import pymysql as mysql


conn = mysql.connect(host='127.0.0.1', user='root', password='', database='db004')
curs = conn.cursor()

user = input("请输入你的用户名>>>")
pwd = input("请输入你的密码>>>")
sql = "select * from usr_pwd where username=%s and password=%s"
res = curs.execute(sql,(user,pwd))
print(res)
print("登录成功" if res else "登录失败")

curs.close()
conn.close()