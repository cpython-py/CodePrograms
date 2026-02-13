import socketserver as sks
import hmac
import os
import hashlib


class MyServer(sks.BaseRequestHandler):
    secret_key = "启动"

    def handle(self):
        # res = "你是合法的用户" if self.auth() else "不是合法的用户"
        print("你是合法的用户" if self.auth() else "不是合法的用户")


    def auth(self):
        conn = self.request
        msg = os.urandom(32)
        conn.send(msg)

        ser_res = hmac.new(self.secret_key.encode(), msg, hashlib.md5).hexdigest()
        # ser_res = hm.hexdigest()
        cli_res = conn.recv(1024).decode()

        return True if ser_res == cli_res else False


server = sks.ThreadingTCPServer(('localhost', 8080), MyServer)
server.serve_forever()
