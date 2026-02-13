class Problem19:
    def __init__(self):
        self.problem_19()

    def problem_19(self):
        prompt = input("请输入你朋友们的名字(使用空格隔开):")
        lst = []
        for i in prompt.split(" "):
            lst.append(i)
        print(len(lst))


if __name__ == "__main__":
    obj = Problem19()