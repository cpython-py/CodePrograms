import pymysql


conn = pymysql.connect(host="localhost", user="root", password="", database="db002")
cursor = conn.cursor()

sql1 = "begin"
sql2 = "update employee set emp_name='程咬钻石' where id=18"
sql3 = "commit"

res1 = cursor.execute(sql1)
res1 = cursor.execute(sql2)
res1 = cursor.execute(sql3)

cursor.close()
conn.close()