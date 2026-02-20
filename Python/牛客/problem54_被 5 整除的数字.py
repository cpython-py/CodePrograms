class Problem54:
    def __init__(self):
        self.problem_54()
    
    def problem_54(self):
        my_list = [i for i in range(1, 51) if i % 5 == 0]
        for _ in my_list:
            print(_)

if __name__ == "__main__":
    obj = Problem54()
