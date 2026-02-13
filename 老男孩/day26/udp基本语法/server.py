import socket as sk


sk = sk.socket(type=sk.SOCK_DGRAM)

sk.bind(('127.0.0.1', 9000))
msg, addr = sk.recvfrom(1024)
print(msg.decode())
# UDP协议下,第一次默认只能接收数据(没有三次握手)
sk.sendto("Hello Two!".encode(), addr)
sk.close()