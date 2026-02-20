class Problem59:
    def __init__(self):
        self.problem_59()
    
    def problem_59(self):
        lst = [3, 45, 9, 8, 12, 89, 103, 42, 54, 79]
        prompt = int(input())
        for i in lst:    
            if prompt == i:
                lst_new = lst[:lst.index(i)]
        for i in lst_new:
            print(i)
    
    
if __name__ == "__main__":
    obj = Problem59()
