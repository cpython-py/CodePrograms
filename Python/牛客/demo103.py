import re


class Cutoff_num(object):

    def __init__(self) -> None:
        self.mode = input()

    def Cutoff_main(self):
        print(re.match('[\d-]+', self.mode).group())


if __name__ == '__main__':
    Cutoff = Cutoff_num()
    Cutoff.Cutoff_main()
