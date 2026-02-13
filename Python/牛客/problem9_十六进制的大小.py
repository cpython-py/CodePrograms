class Problem9:
    def __init__(self):
        self.problem_9()

    def problem_9(self):
        temp = input("请输入一个数:")
        hex_num = int(("0x"+temp), 16)
        # prompt = int(temp, 16)
        print(hex_num)

if __name__ == "__main__":
    obj = Problem9()
