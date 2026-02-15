class Problem30:
    def __init__(self):
        self.problem_30()

    def problem_30(self):
        queue = [1, 2, 3, 4, 5]
        for i in range(2):
            queue.pop(0)
            print(queue)
        append_obj = int(input())
        queue.append(append_obj)
        print(queue)

if __name__ == "__main__":
    obj = Problem30()