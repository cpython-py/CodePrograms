import os


file_lst = os.listdir('.')
for f in file_lst:
    res = os.path.splitext(f)
    print(res[1])

lst = [set(i[1]) for i in os.listdir('.') for j in os.path.splitext(i)]
print(lst)