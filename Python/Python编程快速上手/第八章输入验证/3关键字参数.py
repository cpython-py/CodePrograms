import pyinputplus as pyip
response = pyip.inputNum('1输入数字:', min=4)

response2 = pyip.inputNum('2输入数字:', greaterThan=5)
response3 = pyip.inputNum('3输入数字:', min=4, lessThan=5)

response4 = pyip.inputStr('4输入内容:', blank=True)

