class Problem65:
    def __init__(self):
        self.problem_65()
    
    def problem_65(self):
        lst = ('Tom', 'Tony', 'Allen', 'Cydin', 'Lucy', 'Anna')
        
        prompt = input()
        if prompt in lst:
            print('Congratulations!')
        else:
            print('What a pity!')
        print(lst)

if __name__ == '__main__':
    obj = Problem65()