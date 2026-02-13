def func(lst: list) -> list:
    temp = set(lst)
    return list(temp)

print(func([1, 2, 3, 3]))