class Soldier():
    def attack(self):
        pass
    
    def back(self):
        pass


class Army(Soldier):
    def attack(self):
        print("[陆军]开坦克装甲部队,开大炮轰炸敌方根据地")
        
    def back(self):
        print("[陆军]夜行八百,日行一千")

class Navy(Soldier):
    def attack(self):
        print("[海军]开航空母舰,扔鱼叉,撒网")
        
    def back(self):
        print("[海军]直接跳水")
        
class AirForce(Soldier):
    def attack(self):
        print("[空军]空对地投放原子弹")
        
    def back(self):
        print("[空军]直接跳机,落地成盒")

obj1 = Army()
obj2 = Navy()
obj3 = AirForce()

# lst = [Army(), Navy(), AirForce()]
lst = [obj1, obj2, obj3]

strvar = """
将军请下令:
1.全体出击
2.全体撤退
3.海军上,其他兵种撤退
"""
# print(strvar)

num = input(strvar)
for i in lst:
    if num == "1":
        i.attack()
    elif num == "2":
        i.back()
    elif num == "3":
        if isinstance(i, Navy):
            i.attack()
        else:
            i.back()
    else:
        print("风太大,小弟听不见")
        break