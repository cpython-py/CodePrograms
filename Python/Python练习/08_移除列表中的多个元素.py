def func(lst: list, remove_lst: list) -> list:
    for i in remove_lst:
        lst.remove(i)
    return lst

print(func([1, 2, 3], [1, 2]))