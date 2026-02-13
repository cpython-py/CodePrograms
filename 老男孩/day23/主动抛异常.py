class MyException(BaseException):
    def __init__(self, error_num, error_msg):
        self.error_num = error_num
        self.error_msg = error_msg


eye = "轮回眼"
try:
    if eye == "轮回眼":
        raise MyException(404, "人类没有轮回眼")
except MyException as e:
    print(e.error_num)
    print(e.error_msg)
