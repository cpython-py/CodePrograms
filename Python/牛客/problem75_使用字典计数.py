class Problem75:
    def __init__(self):
        self.problem_75()
        
    def problem_75(self):
        prompt = input()
        char_count = {}
        for char in prompt:
            if char in char_count:
                char_count[char] += 1
            else:
                char_count[char] = 1
        for char, count in char_count.items():
            print(f"'{char}': {count}")
                    
        
    
    
if __name__ == '__main__':
    obj = Problem75()