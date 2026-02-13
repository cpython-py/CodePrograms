import socket as sk
sk = sk.socket()
sk.connect(('127.0.0.1', 9002))

while True:
    prompt = input("请输入您要发送的数据>>>")
    sk.send(prompt.encode())
    
    res = sk.recv(1024).decode()
    
    if res == b'q':
        break
    print(res)

sk.close()