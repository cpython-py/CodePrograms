class Problem46:
    def __init__(self):
        self.problem_46()

    def problem_46(self):
        dishes = {'pizza':10, 'rice':2, 'yogurt':5, 'others':8}
        dish = input('输入菜品名称：')
        print(dishes[dish])

if __name__ == '__main__':
    Problem46()