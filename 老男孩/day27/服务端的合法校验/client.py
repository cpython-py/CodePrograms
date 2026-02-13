import socket as sk
import hmac
import hashlib


sk = sk.socket()
sk.connect(('localhost', 8080))

secret_key = "启动"


def auth(secret_key):
    msg = sk.recv(32)
    cli_res = hmac.new(secret_key.encode(), msg, hashlib.md5).hexdigest()
    # cli_res = hm.hexdigest()
    sk.send(cli_res.encode())


auth(secret_key)

sk.close()
