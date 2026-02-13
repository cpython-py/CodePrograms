class MyClass:
    def __init__(self):
        print("实例化对象触发")
        self.color = "黄色"
obj = MyClass()
print(obj.__dict__)

class MyClass:
    def __init__(self, color):
        self.color = color
        
class Children:
    def __init__(self, name, skin):
        self.name = name
        self.skin = skin

    def cry(self):
        print("小孩可以哭")
    def la(self):
        print("小孩可以拉粑粑")
    def __eat(self):
        print("小孩一下就要生吃奶奶")
    def info(self):
        print(f"小孩的名字:{self.name}\n小孩的肤色:{self.skin}")
    def info(self, name, skin):
        print(f"小孩的名字:{name}\n小孩的肤色:{skin}")

afanda = Children("阿凡达", "蓝色")
afanda.cry()
afanda.la()
afanda.info()

haoke = Children("绿巨人", "绿色")
haoke.la()
haoke.info()
