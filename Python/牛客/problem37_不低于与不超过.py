class Problem37:
    def __init__(self):
        self.problem_37()
    
    def problem_37(self):
        prompt = input().split(" ")
        print("True" if list(map(int, prompt))[0] <= list(map(int, prompt))[1] else "False")
        print("True" if list(map(int, prompt))[0] >= list(map(int, prompt))[2] else "False")


if __name__ == "__main__":
    obj = Problem37()

