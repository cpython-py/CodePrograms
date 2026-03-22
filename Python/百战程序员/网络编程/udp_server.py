import socket

udpSocked = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udpSocked.bind(('localhost', 8080))
print("等待接收数据...")
while True:
    redata = udpSocked.recvfrom(1024)
    send = input('请输入要发送的数据:')
    udpSocked.sendto(send.encode('gbk'), redata[1])
    print(redata)
    print(f"收到远程信息: {redata[0].decode('gbk')}, from {redata[1]}")
udpSocked.close()