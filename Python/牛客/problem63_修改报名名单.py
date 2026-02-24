class Problem63:
    def __init__(self):
        self.problem_63()
    
    def problem_63(self):
        entry_form = ('Niuniu', 'Niumei')
        print(entry_form)
        try:
            entry_form[1] = 'Niukele'
        except TypeError:
            print('The entry form cannot be modified!')

if __name__ == "__main__":
    obj = Problem63()