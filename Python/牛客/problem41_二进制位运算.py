class Problem41:
    def __init__(self):
        self.problem_41()
    
    def problem_41(self):
        num1,num2 = int(input()), int(input())
        print(num1&num2,num1|num2,sep="\n")


if __name__ == "__main__":
    Problem41()