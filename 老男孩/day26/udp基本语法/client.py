import socket as sk


sk = sk.socket(type=sk.SOCK_DGRAM)

msg = "Hello World!"
sk.sendto(msg.encode(), ('127.0.0.1', 9000))
res, addr = sk.recvfrom(1024)
print(res.decode())
sk.close()