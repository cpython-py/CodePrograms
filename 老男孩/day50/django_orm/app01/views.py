from django.shortcuts import render, HttpResponse
from app01 import models
from datetime import datetime
# Create your views here.

def query(request):
    # 增加数据记录
    # new_book = models.Book(
    #     title='金瓶梅',
    #     price=9.9,
    #     pub_date=datetime.now(),
    #     publish='远航程序图灵出版社',
    # )
    # new_book.save()
    # new_book = models.Book.objects.create(
    #     title='铜瓶梅',
    #     price = 19.9,
    #     pub_date = '2026-08-08',
    #     publish = '远航兰兰出版社',
    # )
    # print(new_book.title)
    # print(new_book.pub_date)
    
    obj_list = []
    # for i in range(10):
    #     book_obj = models.Book(
    #         title = f'超级赛亚人{i}',
    #         price = 10 * i,
    #         pub_date = f'2024-08-{i+1}',
    #         publish = '龙族出版社'
    #     )
    #     obj_list.append(book_obj)
    # models.Book.objects.bulk_create(obj_list)
    
    models.Book.objects.filter(id=3).delete()
    models.Book.objects.filter(id=5).update(title='超人')
    return HttpResponse('ok')    