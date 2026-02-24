class Problem66:
    def __init__(self):
        self.problem_66()
    def problem_66(self):
        lst = tuple(range(1,6))
        res = len(lst)
        lst2 = list(lst)
        lst2.extend(range(6, 11))
        print(lst2)


if __name__ == "__main__":
    obj = Problem66()