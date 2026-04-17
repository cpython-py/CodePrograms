from unittest.mock import inplace

import pandas as pd
import numpy as np
from uiautomation import WindowControl

wx = WindowControl(Name='微信')
wx.SwitchToThisWindow()
hw = wx.ListControl(Name='会话')

df  = pd.read_csv('回复数据.csv', encoding='utf-8')
print(df)

while True:
    we = hw.TextControl(searchDepth=4)
    while not we.Exists(0):
        pass
    if we.Name:
        we.Click(simulateMove=True)
        last_msg = wx.ListControl(Name='消息').GetChildren()[-1].Name
        msg = df.apply(lambda x: x['回复内容'] if x['关键词'] in last_msg else None, axis=1)
        msg.dropna(axis=0, how='any', inplace=True)

        if ar:
            wx.SendKeys(ar[0].replace('{br}', '{Shift}{Enter}'), waitTime=0)
            wx.SendKeys('{Enter}', waitTime=0)
            wx.TextControl(SubName=ar[0][:5]).RightClick()
        else:
            wx.SendKeys('我没有理解你的意思', waitTime=0)
            wx.SendKeys('{Enter}', waitTime=0)
            wx.TextControl(SubName=last_msg[:5]).RightClick()