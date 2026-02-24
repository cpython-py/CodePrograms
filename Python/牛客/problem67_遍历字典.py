class Problem67:
    def __init__(self):
        self.problem_67()
    
    def problem_67(self):
        operators_dict = {'<': 'less than','==': 'equal'}
        print('Here is the original dict:')
        for key in sorted(operators_dict.keys()):
            print(f'Operator {key} means {operators_dict[key]}.')
        operators_dict.update({'>': 'greater than'})
        print('The dict was changed to:')
        for key in sorted(operators_dict.keys()):
            print(f'Operator {key} means {operators_dict[key]}.')
    
    
if __name__ == "__main__":
    obj = Problem67()