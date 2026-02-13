# socket 服务端
import socket as sk


# 1. 创建一个socket对象
sk = sk.socket()
# 2. 在网络中注册该主机(绑定IP地址和端口号)
sk.bind( ('127.0.0.1', 9001) )
# 3. 开启监听
sk.listen()
# 4.三次握手
conn, addr = sk.accept()
# 5.收发数据的逻辑
res = conn.recv(1024).decode()
print(res)
conn.send("我也爱你".encode())
# 6.四次握手
conn.close()
# 7.退还端口
sk.close()
