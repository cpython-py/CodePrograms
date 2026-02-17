class Problem36:
    def __init__(self):
        self.problem_36()
    
    def problem_36(self):
        prompt = input().split(" ")
        print("True" if list(map(int, prompt))[0] > list(map(int, prompt))[1] else "False")
        print("True" if list(map(int, prompt))[0] < list(map(int, prompt))[1] else "False")


if __name__ == "__main__":
    obj = Problem36()
    