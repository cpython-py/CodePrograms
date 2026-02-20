class Problem52:
    def __init__(self):
        self.problem_52()
    
    def problem_52(self):
        prompt = list(map(int, input().split(" ")))
        print(sum(prompt), sum(prompt)/len(prompt), sep=" ")
    
if __name__ == "__main__":
    obj = Problem52()