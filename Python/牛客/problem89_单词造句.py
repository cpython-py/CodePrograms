class Problem89:
    def __init__(self):
        self.problem_89()
    
    def problem_89(self):
        word = input()
        words = []
        while word != '0':
            words.append(word)
            word = input()
        print(' '.join(words))
            


if __name__ == "__main__":
    obj = Problem89()