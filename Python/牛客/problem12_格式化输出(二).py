class Problem12:
    def __init__(self):
        self.problem_12()


    def problem_12(self):
        name = "niukele"
        print("{tit}\n{up}\n{low}".format(up=name.upper(), low=name.lower(), tit=name.title()))

if __name__ == "__main__":
    obj = Problem12()
