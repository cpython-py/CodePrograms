student_grades = [
    {'sno': 101, 'sname': "小张", 'sgrade': 88},
    {'sno': 102, 'sname': "小王", 'sgrade': 77},
    {'sno': 103, 'sname': "小李", 'sgrade': 99},
    {'sno': 104, 'sname': "小赵", 'sgrade': 66},
]

def func(lst: list):
    for i in lst:
        return sorted(lst, key=lambda x: x['sgrade'])
    return None


print(func(student_grades))