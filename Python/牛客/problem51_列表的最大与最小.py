class Problem51:
    def __init__(self):
        self.problem_51()
    
    def problem_51(self):
        lst = []
        for i in range(10, 51):
            lst.append(i)   
        print(lst)
        print(lst[0], lst[-1], sep=" ")

if __name__ == "__main__":
    obj = Problem51()