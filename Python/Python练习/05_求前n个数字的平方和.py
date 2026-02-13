def func(n: int):
    lst = [i ** 2 for i in range(1, n+1)]
    return sum(lst)

print(func(3))
