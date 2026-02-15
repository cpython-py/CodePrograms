class Problem24:
    def __init__(self):
        self.problem_24()

    def problem_24(self):
        prompt = list(input().split(" "))
        for i in range(3):
            prompt.pop()
        print(prompt)

if __name__ == "__main__":
    obj = Problem24()
    