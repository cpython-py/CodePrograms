import datetime


last_time = "1949-10-1"
last_time_calc = datetime.datetime.strptime(last_time, "%Y-%m-%d")
now_time = datetime.datetime.now()
now_time_calc = datetime.datetime.strftime(now_time, "%Y-%m-%d")

print(now_time - last_time_calc)