# socket客户端
import socket as sk


sk = sk.socket()
sk.connect(('127.0.0.1', 9001))
sk.send("爱你".encode())
res = sk.recv(1024).decode()
print(res)
sk.close()
