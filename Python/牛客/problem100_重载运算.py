class Coordinate(object):

    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y

    def __str__(self):
        return (f"({self.x}, {self.y})")

    def __add__(self, other):
        return Coordinate(self.x+other.x, self.y+other.y)


if __name__ == '__main__':
    one = input().split()
    two = input().split()
    c1 = Coordinate(int(one[0]), int(one[1]))
    c2 = Coordinate(int(two[0]), int(two[1]))
    print(c1+c2)