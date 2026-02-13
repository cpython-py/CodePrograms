class MyClass():
    def __bool__(self):
        return False

obj = MyClass()
print(bool(obj))