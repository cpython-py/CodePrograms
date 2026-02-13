from multiprocessing import Process, Event
import time

### 模拟红绿灯
def traffic_light(e):
    print("红灯亮了...")
    
    while True:
        if e.is_set():
            time.sleep(1)
            print("红灯亮了...")
            e.clear()
        else:
            time.sleep(1)
            print("绿灯亮了...")
            e.set()

e = Event()
traffic_light(e)