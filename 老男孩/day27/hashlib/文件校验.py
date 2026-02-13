import hashlib as hl

def check_md5(filename):
    hs = hl.md5()
    with open(filename, 'rb') as fp:
        hs.update(fp.read())
    return hs.hexdigest(), filename


res1, fn1 = check_md5('测试1.py')
res2, fn2 = check_md5('测试2.py')

# if res1 == res2:
#     print("{}与{}哈希校验成功!".format(res1, res2))
# else:
#     print("{}与{}哈希校验失败!".format(res1, res2))

res = f"\'{fn1}\' 与 \'{fn2}\'  哈希校验成功!" if (res1 == res2) else f"\'{fn1}\' 与 \'{fn2}\'  哈希校验失败!"
print(res)