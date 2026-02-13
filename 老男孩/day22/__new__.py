class MyClass2():
    a = 100
obj2 = MyClass2()   
class MyClass1():
    def __new__(cls):
        return obj2
        

obj = MyClass1()
print(obj.a)
