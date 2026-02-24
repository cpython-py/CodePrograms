class Problem61:
    def __init__(self):
        self.problem_61()
    def problem_61(self):
        list_org = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        prompt = int(input())
        list_new = [[j * prompt for j in i] for i in list_org]
        print(list_new)

if __name__ == '__main__':
    obj = Problem61()