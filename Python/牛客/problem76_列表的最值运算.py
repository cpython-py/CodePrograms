class Problem76:
    def __init__(self):
        self.problem_76()
        
    def problem_76(self):
        prompt = list(map(int,input().split()))
        print(max(prompt), min(prompt))

    
if __name__ == '__main__':
    obj = Problem76()