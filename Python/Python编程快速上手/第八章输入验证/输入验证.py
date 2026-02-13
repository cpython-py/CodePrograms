while True:
    print("请输入你的年龄")
    age = input()
    try:
        age = int(age)
    except:
        print("请输入数字")
        continue
    if age < 1:
        print("请输入一个确切的数字")
        continue
    break

print(f"你的年龄是{age}")
