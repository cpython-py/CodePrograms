class Problem64:
    def __init__(self):
        self.problem_64()
    
    def problem_64(self):
        prompt = tuple(input().split(" "))
        print(prompt[:3])

    
if __name__ == "__main__":
    obj = Problem64()