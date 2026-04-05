from django.http import HttpResponse
from django.shortcuts import render

from App01.models import User


# Create your views here.
def home(request):
    # return HttpResponse("首页")
    # 查询数据库
    users = User.objects.all()
    print(users)
    return render(request, "index.html", context={'title': 'django', 'name': 'Jack', 'users':users})


def show(request, age):
    print(type(age))
    return HttpResponse(str(age))


def list(request, name):
    print(name, type(name))
    return HttpResponse(name)


def access(request, path):
    return HttpResponse(path)


def get_phone(request, phone):
    print(request.GET)
    print(request.GET.get('username'))
    print(request.GET.getlist('age'))

    print(request.POST.get('username'))
    print(request.POST.getlist('hobby'))

    print(request.method)
    print("-"*60)
    print(request.path)
    print("_"*60)
    print(request.META)
    print("_"*60)
    # 客户端地址
    print(request.META.get('REMOTE_ADDR'))
    print("-"*60)
    # 来源页面
    print(request.META.get('HTTP_REFERER'))
    # 常用方法
    print(request.get_full_path())
    print(request.get_host())
    print(request.build_absolute_uri())
    print(request.GET.dict())
    return HttpResponse(phone)