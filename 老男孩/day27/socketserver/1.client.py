import socket as sk


sk = sk.socket()
sk.connect(('localhost', 8080))
while True:
    sk.send(b'Hello world')
    res = sk.recv(1024).decode()
    print(res)

sk.close()