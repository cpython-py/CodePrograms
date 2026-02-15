class Problem25:
    def __init__(self):
        self.problem_25()

    def problem_25(self):
        lst = ['p', 'y', 't', 'h', 'o', 'n']
        lst_sorted = sorted(lst)
        lst_reverse = sorted(lst, reverse=True)

        print(lst_sorted, lst, lst_reverse, sep="\n")


if __name__ == "__main__":
    obj = Problem25()