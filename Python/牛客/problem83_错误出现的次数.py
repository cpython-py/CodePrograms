class Problem83:
    def __init__(self):
        self.problem_83()

    def problem_83(self):
        times = 0
        prompt = list(map(int, input().split()))     
        print(sum(prompt))


if __name__ == "__main__":
    obj = Problem83()