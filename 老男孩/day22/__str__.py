class Cat():
    gift = "抓老鼠"
    def __init__(self, name):
        self.name = name
        
    def cat_gift(self):
        return "小猫叫{}, 小猫会{}".format(self.name, self.gift)
    
    def __str__(self):
        return self.cat_gift()
    
tom = Cat("汤姆")
res = str(tom)
print(res)