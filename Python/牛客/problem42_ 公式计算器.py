class Problem42:
    def __init__(self):
        self.problem_42()
    
    def problem_42(self):
        prompt = list(map(int,input().split(" ")))     
        print((prompt[0]+prompt[1]) * (prompt[2]-prompt[3]))

if __name__ == "__main__":
    obj = Problem42()
    