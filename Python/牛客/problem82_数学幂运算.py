class Problem82:
    def __init__(self):
        self.problem_82()
    
    def problem_82(self):
        prompt = list(map(int,(input().split())))
        # print(type(prompt))
        print(prompt[0]**prompt[1], prompt[1]**prompt[0],sep='\n')


if __name__ == "__main__":
    obj = Problem82()