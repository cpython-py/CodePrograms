def func(start, end):
    lst = []
    for i in range(start, end, 2):
        lst.append(i)
    return lst

print(func(4, 18))