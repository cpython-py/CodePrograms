class Problem71:
    def __init__(self):
        self.problem_71()
    
    def problem_71(self):
        result_dict = {'Allen': ['red', 'blue', 'yellow'],'Tom': ['green', 'white', 'blue'],'Andy': ['black', 'pink']}
        for key in sorted(result_dict.keys()):
            print('{}\'s favorite colors are:'.format(key))
            for value in sorted(result_dict[key]):
                print('{}'.format(value))
    
if __name__ == "__main__":
    obj = Problem71()