# from multiprocessing import Process
# import os, time

# def run_proc(name):
#     with open("debug_child.txt", "a+") as f:
#         f.write(f"run child {name} ({os.getpid()})\n")
    
# if __name__ == "__main__":
#     print("Parent process id %s is running" % os.getpid())
#     p = Process(target=run_proc, args=('test',))
#     print('Child process will start...')
#     p.start()
#     p.join()
#     time.sleep(3)
#     print("child process end...")
    
# print("_" * 60)

# from multiprocessing import Pool
# import os, time, random

# def long_time_task(name):
#     print("run task %s (%s)" % (name, os.getpid()))
#     start = time.time()
#     time.sleep(random.random() * 3)
#     end = time.time()
#     print("tasks run all time is %.2f" % (end-start))
    
# if __name__ == "__main__":
#     print("parent %s running" % os.getpid())
#     p = Pool(12)
#     for i in range(13):
#         p.apply_async(long_time_task, args=(i,))
#     print("wait for all subprocess done")
#     p.close();p.join()
#     print("All subprocess done")

# from re import sub

# import subprocess

# # print("$ nslookup www.python.org")
# # r = subprocess.call(['nslookup', 'www.python.org'])
# # print("exit code", r)

# print("$ nslookup")
# p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
# print(output.decode("utf-8"))
# print("exit code: ", p.returncode)

import sys

print(sys.argv)
source = sys.argv[1]
target = sys.argv[2]