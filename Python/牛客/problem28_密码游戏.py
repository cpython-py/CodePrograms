class Problem28:
    def __init__(self):
        self.problem_28()

    def problem_28(self):
        prompt = int(input())
        w1 = prompt // 1000
        w2 = prompt // 100 % 10
        w3 = prompt % 100 // 10
        w4 = prompt % 10

        x1 = (w1 + 3) % 9
        x2 = (w2 + 3) % 9
        x3 = (w3 + 3) % 9
        x4 = (w4 + 3) % 9

        print(x3, x4, x1, x2)


if __name__ == "__main__":
    obj = Problem28()