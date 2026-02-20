class Problem60:
    def __init__(self):
        self.problem_60()
    
    def problem_60(self):
        lst = []
        for i in range(16):
            if i == 13:
                continue
            lst.append(i)
        print(lst)

    
if __name__ == "__main__":
    obj = Problem60()