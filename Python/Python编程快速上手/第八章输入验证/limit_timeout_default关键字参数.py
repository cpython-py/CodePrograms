import pyinputplus as pyip

response = pyip.inputNum("请输入数字", limit=2, default="error")
print(response)
response = pyip.inputNum("请输入数字", timeout=2)

