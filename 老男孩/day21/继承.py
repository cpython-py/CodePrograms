class Human():
    eye = "黑色的"
    
    def jump(self):
        print("古代人类都会上树")
    def beat_animals(self):
        print("古代人类都会打猎")
    def __makefire(self):
        print("古代人类会生火")

class Man(Human):
    def beat_animals2(self):
        print("男人打猎更猛")

obj = Man()
obj.jump()
obj.beat_animals()


class Father:
    property = "风流倜傥"
    def hobby(self):
        print("吃喝")
        
class Mother:
    property = "貌美如花"
    def hobby(self):
        print("社会摇")
        
class Daughter(Father, Mother):
    pass

obj = Daughter()
print(obj.property)

class Son(Father, Mother):
    def skill(self):
        # Father.hobby()
        print(Mother.property) 
    def skill2(self):
        print(super())
        print(super().property)
        super().hobby()
print("<--------------------->")
obj2 = Son()
obj2.skill()
obj2.skill2()

back = issubclass(Son, Father) 
print("第一个类是第二个类的子类" if back == True else "第一个类不是第二个类的子类")

lst = Son.mro()
print(lst)