'''
Author: cpython-py zero888_666@qq.com
Date: 2026-03-01 20:13:07
LastEditors: cpython-py zero888_666@qq.com
LastEditTime: 2026-03-01 20:52:25
FilePath: \Code\Python\Python黑帽子\1.py
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
'''
import socket

target_host = "www.baidu.com"
target_port = 80

# 建立一个socket对象
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 连接客户端
client.connect((target_host, target_port))

# 发送一些数据
client.send(b"GET / HTTP/1.1\r\nHost: www.baidu.com\r\n\r\n")

# 接收一些数据
response = client.recv(2048)

print(response.decode())
"""
AF_INET参数说明使用ipv4地址或者主机名
SOCK_STREAM参数说明这是一个tcp客户端
"""