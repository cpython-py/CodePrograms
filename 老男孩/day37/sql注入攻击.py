import pymysql as mysql


conn = mysql.connect(host='localhost', user='root', password='', database='db004')
curs = conn.cursor()

# sql = """
# create table usr_pwd(
# id int unsigned primary key auto_increment,
# username varchar(255) not null,
# password varchar(255) not null
# )
# """
# curs.execute(sql)

user = input("请输入你的用户名>>>")
pwd = input("请输入你的密码>>>")

sql2 = "SELECT * FROM usr_pwd WHERE username='%s' and password='%s'" % (user, pwd)
res = curs.execute(sql2)
print(res)

print("登录成功" if res == 1 else "登录失败")

curs.close()
conn.close()