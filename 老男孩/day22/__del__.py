class Lion():
    def __init__(self, name):
        self.name = name

    def __del__(self):
        print("析构对象被触发")
        
obj = Lion("辛巴")
print("<================>")
del obj
        