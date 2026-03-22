import re

def check(word):
    if re.findall(r"^s.*?t$", word):
        print("检查正确✅️")
        return True
    else:
        print("检查错误❌️")
        return False 
    
print("请写出5到10个以s开头,t结尾的单词>>>") 
for i in range(1, 12):
    if i == 11:
        break
    word = input(f"请写出第{i}个单词")
    check(word)
    if not check(word):
        print("停止测试!!!")
        break
    
    if i == 5:
        command = input("您已经写出来5个单词,是否继续?(y/n)")       
        if command == "y":
            continue
        #    word = input(f"请写出第{i+1}个单词")
        #    check(word)
        #    if not check(word):
            #    print("停止测试!!!")
            #    break
        elif command == "n":
            break
 