class Problem77:
    def __init__(self):
        self.problem_77()
    
    def problem_77(self):
        prompt = list(map(int, input().split()))
        print(sum(prompt))

    
if __name__ == '__main__':
    obj = Problem77()