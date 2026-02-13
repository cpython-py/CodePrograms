import os
from multiprocessing import Process


def func():
    print("1.子进程id:{}, 2.父进程di:{}".format(os.getpid(), os.getppid()))

if __name__ == '__main__':
    p = Process(target=func)
    p.start()
    print("1.子进程id:{}, 2.父进程id:{}".format(os.getpid(), os.getpid()))

