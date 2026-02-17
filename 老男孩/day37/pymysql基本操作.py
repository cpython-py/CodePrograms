import pymysql


# 创建连接对象
conn = pymysql.connect(host="localhost", user="root", password="", database="db002", charset="utf8", port=3306)
# 创建游标对象
cursor = conn.cursor()
print(cursor)


# 执行sql语句
sql = "SELECT * FROM employee"
res = cursor.execute(sql)
print(res)

# 获取数据 fetchone()获取一条数据,类似于迭代器
res = cursor.fetchone()
print(res)
res = cursor.fetchone()
print(res)
res = cursor.fetchone()
print(res)

# 释放游标对象
cursor.close()
# 释放连接对象
conn.close()
