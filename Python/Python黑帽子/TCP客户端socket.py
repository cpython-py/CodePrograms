import socket

target_host = "www.baidu.com"
target_port = 80

# NOTE - 建立一个socket对象
# 
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













# LINK - www.baidu.com



























# NOTE -agc