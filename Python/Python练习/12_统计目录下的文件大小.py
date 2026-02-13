import os

total = []
for f in os.listdir('.'):
    size = os.path.getsize(f)
    total.append(size)
    
print(sum(total))