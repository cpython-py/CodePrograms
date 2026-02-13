def kuozhan(_func):
    def newFunc():
        print("厕所前 ... 干净整齐")
        _func()
        print("厕所后 ... 臭气熏天")
    return newFunc 

@kuozhan
def func():
    print("我是高富帅...")

func()