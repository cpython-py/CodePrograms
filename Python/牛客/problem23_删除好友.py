class Problem23:
    def __init__(self):
        self.problem_23()

    def problem_23(self):
        prompt = input().split(" ")
        remove_obj = input()
        prompt.remove(remove_obj)
        print(prompt)

if __name__ == "__main__":
    obj = Problem23()

        