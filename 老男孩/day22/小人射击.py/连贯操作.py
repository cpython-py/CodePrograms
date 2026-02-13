class A():
    aaa = 100

class B():
    def __init__(self,obj):
        self.pty = obj

obj1 = A()
obj2 = B(obj1)

print(obj2.pty.aaa)


