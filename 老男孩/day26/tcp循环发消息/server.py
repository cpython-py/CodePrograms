import socket as sk
sk = sk.socket()
sk.bind(('127.0.0.1', 9002))
sk.listen()

while True:
    
    conn, addr = sk.accept()
    # print(conn)
    # print(addr)


    while True:
        res = conn.recv(1024).decode()
        print(res)
        
        strvar = input("[服务端]请输入您要发送的数据>>>")
        conn.send(strvar.encode())
        
        if strvar == 'q':
            break

    conn.close()
    
sk.close()