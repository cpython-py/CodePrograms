def func(start: int, end: int):
    lst = []
    if start < end:
        for i in range(start, end+1):
            if is_prime(i):
                lst.append(i)
    return lst


def is_prime(num: int) -> bool:
    if num <= 2:
        return True
    else:
        for i in range(2, num):
            if num % i == 0:
                return False
        return True

print(func(2, 1))
