class Singleton():
    __obj = None
    def __new__(cls):
        if cls.__obj is None:
            cls.__obj = object.__new__(cls)
        return cls.__obj

obj1 = Singleton()
obj2 = Singleton()
obj3 = Singleton()
print(obj1, obj2, obj3)