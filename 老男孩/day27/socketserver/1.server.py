import socketserver as sks


class MyServer(sks.BaseRequestHandler):
    def handle(self):
        print("handle方法被触发了......")

        while True:
            conn = self.request
            res = conn.recv(1024).decode()
            print(res)
            conn.send(res.upper().encode())

server = sks.ThreadingTCPServer(('localhost', 8080), MyServer)
server.serve_forever()
