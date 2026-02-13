from threading import Thread, Lock


n = 0
def func1(lock):
    global n
    with lock:
        for i in range(1000000):
            i += 1
    
def func2(lock):
    global n
    with lock:
        for i in range(1000000):
            i -= 1
            
if __name__ == "__main__":
    lst = []
    lock = Lock()
    for i in range(10):
        t1 = Thread(target=func1, args=(lock,))
        t2 = Thread(target=func2, args=(lock,))
        
        t1.start()
        t2.start()
        
        lst.append(t1)
        lst.append(t2)
    
    for i in lst:
        i.join()
    
    print("主线程执行完毕...", n)