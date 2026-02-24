class Problem68:
    def __init__(self):
        self.problem_68()
    def problem_68(self):
        survey_list = ['Niumei','Niu Ke Le','GURR','LOLO']
        result_dict = {'Niumei': 'Nowcoder','GURR': 'HUAWEI'}
        for survey in survey_list:
            if survey in result_dict.keys():
                print('Hi, Niumei! Thank you for participating in our graduation survey!')
            else:
                print('Hi, Niu Ke Le! Could you take part in our graduation survey?')

if __name__ == "__main__":
    obj = Problem68()