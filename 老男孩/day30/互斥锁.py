from multiprocessing import Process, Lock

# 创建锁对象
lock = Lock()
lock.acquire()
# lock.acquire()
print("我在袅袅炊烟...")
lock.release()



# ###模拟12306


# import json
# def wr_info(sign, dic=None):
#     if sign == "r":
#         with open("ticket.txt", "r") as fp:
#             dic = json.load(fp)
#         return dic
    
#     elif sign == "w":
#         with open("ticket.txt", "w") as fp:
#             json.dump(dic, fp)
#         return
    
# res = wr_info("r")   
# print(res, type(res))

# # "{'count': 0}"
# strv = "{'count': 0}"


# ###创建信号量Semaphore对象
from multiprocessing import Semaphore, Process

sem = Semaphore(5)

sem.acquire()
print("信号量...")
sem.release()