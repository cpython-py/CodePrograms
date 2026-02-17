class Problem35:
    def __init__(self):
        self.problem_35()
    
    def problem_35(self):
        prompt = input().split(" ")
        print("True" if prompt[0] == prompt[1] else "False")

if __name__ == "__main__":
    obj = Problem35()