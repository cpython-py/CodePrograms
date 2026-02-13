import hashlib as hl




while True:

    # 1.基本语法
    hs = hl.md5()
    # 2.把字节流更新到对象中进行加密
    prompt = input("请输入要加密的密码:")
    hs.update(prompt.encode())
    # 3.获取十六进制字符串
    res = hs.hexdigest()
    print(res, len(res))

    if prompt == 'q':
        break