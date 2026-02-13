from multiprocessing import Process, Queue


q = Queue()
q.put("hello")
print(q.get_nowait())
print(q.get_nowait())