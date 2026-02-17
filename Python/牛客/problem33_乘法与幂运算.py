class Problem33:
    def __init__(self):
        self.problem_33()
    
    def problem_33(self):
        num1 = int(input())
        num2 = int(input())
        print(num1*num2, num1**num2, sep="\n")

if __name__ == "__main__":
    obj = Problem33()