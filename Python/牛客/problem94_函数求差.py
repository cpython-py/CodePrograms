class Problem94:
    def __init__(self):
        self.problem_94()
    
    def problem_94(self):
        
        x = int(input())
        y = int(input())
        def cal(x, y):
            print(x - y)
            print(y - x)
        
        cal(x, y)
        
        
if __name__ == "__main__":
    obj = Problem94()