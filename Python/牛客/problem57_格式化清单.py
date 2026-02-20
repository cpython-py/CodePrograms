class Problem57:
    def __init__(self):
        self.problem_57()
    
    def problem_57(self):
        lst = ['apple', 'ice cream','watermelon', 'chips','hotdogs', 'hotpot']
        for _ in range(len(lst)):
            lst.pop()
            print(lst)

if __name__ == '__main__':
    obj = Problem57()