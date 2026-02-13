class MyClass():
    def __call__(self):
        print("__call__魔术方法被触发")

obj = MyClass()
obj()