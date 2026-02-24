class Problem70:
    def __init__(self):
        self.problem_70()
    
    def problem_70(self):
        cities_dict = {'Beijing': {'Capital': 'China'},'Moscow': {'Capital': 'Russia'},'Paris': {'Capital': 'France'}}
        for city in sorted(cities_dict.keys()):
            print(f"{city} is the capital of {cities_dict[city]['Capital']}")
    
if __name__ == '__main__':
    obj = Problem70()
