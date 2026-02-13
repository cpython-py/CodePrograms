class Mouse():
    gift = "偷油吃"
    def __init__(self, name):
        self.name = name
    def mouse_gift(self):
        return "老鼠叫{}, 老鼠会{}".format(self.name, self.gift)
    def __repr__(self):
        return self.mouse_gift()
    
jerry = Mouse("杰瑞")
res = repr(jerry)
print(res)
    