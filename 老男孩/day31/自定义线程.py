# Title: 自定义线程
# form: py



from threading import Thread,current_thread, enumerate
import os, time


"""
# 自定义线程类
class MyThread(Thread):
    def __init__(self, name):
        super().__init__()
        self.name = name

    def run(self):
        print("当前进程号{}, name={}".format(os.getpid, self.name))


if __name__ == "__main__":
    t = MyThread("我是线程")
    t.start()
    print("当前进程号{}".format(os.getpid))

# is_alive()

def func():
    time.sleep(1)

if __name__ == "__main__":
    t = Thread(target=func)
    t.start()
    print(t.is_alive())

    # getName()
    print(t.name)
    t.name = "抓API接口"
    print(t.name)
"""

# current_thread, enumerate
def func():
    time.sleep(0.1)
    print("当前子线程号ID是{},进程号ID是{}".format(current_thread().ident, os.getpid()))

if __name__ == "__main__":
    t = Thread(target=func)
    t.start()
    print("当前主线程号ID是{},进程号ID是{}".format(current_thread().ident, os.getpid()))

    for i in range(5):
        t = Thread(target=func)
        t.start()
        lst = enumerate()
    
    print(lst)

