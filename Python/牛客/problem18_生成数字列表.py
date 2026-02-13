class Problem18:
    def __init__(self):
        self.problem_18()

    def problem_18(self):
        lst = []
        prompt = input("请输入一些数字(使用空格隔开):")
        res = prompt.split(" ")
        for i in res:
            lst.append(int(i))
        print(lst)

if __name__ == "__main__":
    obj = Problem18()
