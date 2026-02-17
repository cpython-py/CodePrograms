import pymysql
conn = pymysql.connect(host='localhost', user='root', password='', database='db004')
curs = conn.cursor()

sql = "insert into t1(first_name, last_name, sex, age, money) values(%s, %s, %s, %s, %s)"
res = curs.execute(sql, ("孙", "建", 0, 15, 20000))
print(res)

conn.commit()
curs.close()
conn.close()