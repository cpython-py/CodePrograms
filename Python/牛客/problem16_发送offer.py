class Problem16:
    def __init__(self):
        self.problem_16()

    def problem_16(self):
        offer_list = ['Allen', 'Tom']
        if 'Tom' in offer_list:
            offer_list[1] = 'Andy'

        for person in offer_list:
            prompt = "{}, you have passed our interview and will soon become a member of our company".format(person)
            print(prompt)


if __name__ == "__main__":
    obj = Problem16()