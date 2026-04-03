import math
class Problem96:
    def __init__(self):
        self.problem_96()
        
    def problem_96(self):
        r_array = [1, 2, 4, 9, 10, 13]
        def area(r):
            print("%.2f" % (4 * math.pi * r * r))
        
        for i in range(6):
            area(r_array[i]) 
            
if __name__ == "__main__":
    obj = Problem96()