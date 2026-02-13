class Problem6:
    def __init__(self):
        self.problem_6()

    def problem_6(self):
        prompt = float(input("请输入一个小数:"))
        print("你输入的小数是 %.2f" % prompt)

if __name__ == "__main__":
    obj = Problem6()