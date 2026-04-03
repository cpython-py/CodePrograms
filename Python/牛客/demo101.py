import re


class Regular_expression(object):

    def __init__(self) -> None:
        self.mode = input()

    def Regular_main(self):
        print(re.match('https://www', self.mode).span())


if __name__ == '__main__':
    Regular = Regular_expression()
    Regular.Regular_main()
