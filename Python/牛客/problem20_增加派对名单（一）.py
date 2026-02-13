class Problem20:
    def __init__(self):
        self.problem_20()

    def problem_20(self):
        prompt = input("请输入你朋友们的名字(使用空格隔开):")
        lst = []
        for i in prompt.split(" "):
            lst.append(i)
        lst.append('Allen')

        print(lst)


if __name__ == "__main__":
    obj = Problem20()