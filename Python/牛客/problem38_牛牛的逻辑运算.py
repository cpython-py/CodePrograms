class Problem38:
    def __init__(self):
        self.problem_38()
    
    def problem_38(self):
        prompt = list(map(int, input().split(" ")))
        x, y = prompt[0], prompt[1]
        print(x and y, x or y, not x, not y, sep="\n")


if __name__ == "__main__":
    obj = Problem38()