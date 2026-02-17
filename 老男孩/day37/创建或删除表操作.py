import pymysql


conn = pymysql.connect(host="127.0.0.1", user="root", password="", database="db002", charset="utf8", port=3306)
cursor = conn.cursor()
# 1.创建一张表
sql = """
create table table1(
id int unsigned primary key auto_increment,
name varchar(255) not null,
first_name varchar(255) not null,
last_name varchar(255) not null,
sex tinyint not null,
age tinyint unsigned not null,
money float
)
"""

# res = cursor.execute(sql)
# print(res)

# sql = "desc table1"
# res = cursor.execute(sql)
# print(res) # 返回字段的个数
# res = cursor.fetchone()
# print(res)  # 返回第一行数据


# 删除一张表
sql = "drop table table1"
res = cursor.execute(sql)
print(res)

cursor.close()
conn.close()