class Problem40:
    def __init__(self):
        self.problem_40()
    
    def problem_40(self):
        club_members_list = input().split(" ")
        test_is_in_club = input()
        print(True if test_is_in_club in club_members_list else False)


if __name__ == "__main__":
    obj = Problem40()