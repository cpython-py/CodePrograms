__author__="zhao"

import tkinter as tk
import random
import threading
import time

def dow():
    window = tk.Tk()
    width=window.winfo_screenwidth()
    height=window.winfo_screenheight()
    a=random.randrange(0,width)
    b=random.randrange(0,height)
    window.title('惊喜')
    window.geometry("250x50"+"+"+str(a)+"+"+str(b))
    # 生成随机颜色
    r = lambda: random.randint(0,255)
    color = '#%02X%02X%02X' % (r(),r(),r())
    # 多种表白文案列表
    love_texts = [
        '可以做我女朋友嘛~',
        '我喜欢你~',
        '你是我的唯一',
        '余生都是你',
        '想你到失眠',
        '心动不止一次',
        '只想和你在一起',
        '你是我心中最美的风景',
        '爱你直到永远',
        '遇见你是我最大的幸运',
        '想和你看遍世间美景',
        '你是我最甜蜜的负担',
        '每一天都想念你',
        '你让我相信爱情',
        '只想守护你的笑容'
    ]
    # 随机选择一条表白文案
    selected_text = random.choice(love_texts)
    tk.Label(window,
        text=selected_text,    # 标签的文字
        bg=color,     # 随机背景颜色
        font=('楷体', 22),     # 字体和字体大小
        width=128, height=2  # 标签长宽
        ).pack()    # 固定窗口位置
    window.mainloop()

threads = []
for i in range(100):#需要的弹框数量
    t = threading.Thread(target=dow)
    threads.append(t)
    time.sleep(0.1)
    threads[i].start()