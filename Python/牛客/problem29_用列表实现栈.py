class Problem29:
    def __init__(self):
        self.problem_29()

    def problem_29(self):
        stack = [1, 2, 3, 4, 5]
        for i in range(2):
            stack.pop()
            print(stack)
        append_obj = int(input())
        stack.append(append_obj)
        print(stack)

if __name__ == "__main__":
    obj = Problem29()