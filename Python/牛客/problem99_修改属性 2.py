class Employee:
    def __init__(self, name, salary, age):
        self.name = name
        self.salary = salary
        self.age = age
        self.printclass()
    
    def printclass(self):
        print("{0}'s salary is {1}, and his age is {2}".format(self.name, self.salary, self.age))
name_i = input()
salary_i = int(input())
try:
    age_i = int(input())
except:
    print("False.")
else:
    print("True")
if __name__ == "__main__":
    obj = Employee(name_i, salary_i, age_i)