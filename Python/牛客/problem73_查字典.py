class Problem73:
    def __init__(self):
        self.problem_73()
        
    def problem_73(self):
        dictv = {'a': ['apple', 'abandon', 'ant'], 'b': ['banana', 'bee', 'become'], 'c': ['cat', 'come'], 'd': 'down'}
        select = input()
        print(dictv[select])

    
if __name__ == '__main__':
    obj = Problem73()