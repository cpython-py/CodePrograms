class Problem39:
    def __init__(self):
        self.problem_39()
    
    def problem_39(self):
        s1 = input()
        s2 = input()
        print(s1 == s2, s1.lower() == s2.lower(), sep="\n")


if __name__ == "__main__":
    obj = Problem39()