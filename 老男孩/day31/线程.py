# Title: 线程


"""
进程:资源分配的最小单位
线程:CPU调度的最小单位
"""


from threading import Thread
from multiprocessing import Process
import os, time, random


# def func(i):
#     time.sleep(random.uniform(0.1, 0.8))
#     print("当前进程号:{}".format(os.getpid()), i)


# if __name__ == "__main__":
#     for i in range(10):
#         t = Thread(target=func, args=(i,))
#         t.start()

# print(os.getpid())


# 多线程的速度
def func(i):
    print("当前进程号:{}, 参数是{}".format(os.getpid(), i))

# if __name__ == "__main__":
#     lst = []
#     startime = time.time()
#     for i in range(1000):
#         t = Thread(target=func, args=(i,))
#         t.start()
#         lst.append(t)
#     for i in lst:
#         i.join()
#     endtime = time.time()
#     print("代码的运行时间是{}".format(endtime - startime))


# 多进程速度
# if __name__ == "__main__":
#     lst = []
#     startime = time.time()
#     for i in range(1000):
#         p = Process(target=func, args=(i,))
#         p.start()
#         lst.append(p)
#     for i in lst:
#         i.join()
#     endtime = time.time()
#     print("代码的运行时间是{}".format(endtime - startime))


# 多线程之间数据共享
num, lst = 101, []
def func():
    global num
    num -= 1

for i in range(100):
    t = Thread(target=func)
    t.start()
    lst.append(t)

for i in lst:
    i.join()

print(num)