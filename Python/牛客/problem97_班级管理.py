class Problem97:
    def __init__(self):
        self.problem_97()
        
    def problem_97(self):
        name = input()
        student_number = input()
        grade = input()
        submitted = input()
        print("""
              {0}'s student number is 
              {1}, and his grade is 
              {2}. He submitted 3 assignments, each with a grade of 
              {3}""".format(name, student_number, grade, submitted)
              )
        
        
if __name__ == "__main__":
    obj = Problem97()