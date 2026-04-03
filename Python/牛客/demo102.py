import re


class Extract_num(object):

    def __init__(self) -> None:
        self.mode = input()

    def Extract_main(self):
        print(re.sub(r'\D', "", self.mode))


if __name__ == '__main__':
    Extract = Extract_num()
    Extract.Extract_main()
