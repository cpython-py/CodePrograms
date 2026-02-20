class Problem58:
    def __init__(self):
        self.problem_58()
        
    def problem_58(self):
        users_list = ['Niuniu', 'Niumei', 'HR', 'Niu Ke Le', 'GURR', 'LOLO']
        for _ in users_list:
            if _ == 'HR':
                print('Hi, HR! Would you like to hire someone?')
            else:
                print(f"Hi, {_}! Welcome to Nowcoder!")
                
if __name__ == "__main__":
    obj = Problem58()