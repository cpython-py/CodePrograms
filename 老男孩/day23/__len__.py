class MyClass():
    pty1, pty2, __pty3 = 1, 2, 3
    def __len__(self):
        return 6
    
obj = MyClass()
print(len(obj))