class Problem32:
    def __init__(self):
        self.problem_32()

    def problem_32(self):
        num1, num2 = int(input("请输入第一个数字: ")), int(input("请输入第二个数字: "))
        print(num1+num2, num1-num2, sep="\n")


if __name__ == "__main__":
    obj = Problem32()