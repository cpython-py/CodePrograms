class Problem72:
    def __init__(self):
        self.problem_72()
        
    def problem_72(self):
        key = input().split(" ")
        value = input().split(" ")
        res = zip(key, value)
        print(dict(res))

    
if __name__ == "__main__":
    obj = Problem72()