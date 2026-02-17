class Problem34:
    def __init__(self):
        self.problem_34()
    
    def problem_34(self):
        num1 = int(input())
        num2 = int(input())
        print(num1//num2, num1%num2)
        print("%.2f" % (num1/num2))

if __name__ == "__main__":
    obj = Problem34()