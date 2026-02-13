class MyClass():
    def __init__(self, num):
        self.num = num
    
    def __add__(self, other):
        print(self)
        print(other)
        self.num * 3 + other

a = MyClass(3)
res = a + 1
print(res)
