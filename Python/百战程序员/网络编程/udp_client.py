from socket import *

udpSocket = socket(AF_INET, SOCK_DGRAM)
addr = ("localhost", 8080)
print("输入exit退出")
while True:
    data = input('请输入要向服务器发送的数据:')
    recv = udpSocket.recvfrom(1024)
    print(f"服务器返回: {recv[0].decode('gbk')}")
    if data == 'exit':
        break
    else:
        udpSocket.sendto(data.encode('gbk'), addr)
udpSocket.close()