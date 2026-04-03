class Problem95:
    def __init__(self):
        def fib(n):  # 将fib函数移到这里，作为局部函数
            if n <= 2:
                return 1
            return fib(n-1) + fib(n-2)
        
        result = fib(6)  # 调用局部函数并传入参数
        print(result)  # 打印结果
        
if __name__ == "__main__":
    obj = Problem95()