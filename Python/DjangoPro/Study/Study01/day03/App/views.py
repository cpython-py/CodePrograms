from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse

# Create your views here.
def index(request):
    return HttpResponse('Hello World!')


def show(request):
    return HttpResponse('show...')
def html(request):
    return render(request, 'index.html')


def json(request):
    return JsonResponse({'code': 1})

def json2(request):
    return JsonResponse([1, 2, 3, 4, 5], safe=False) # 不是字典, 需要设置 safe=False

# 重定向
def red(request):
    # return HttpResponseRedirect('/home/index')
    return redirect('/home/index')

def baidu(request):
    return redirect('https://www.baidu.com')


def rev(request):
    print(1 / 0)
    return redirect(reverse('App:index'))

# 测试404页面
from django.shortcuts import render
from django.http import Http404

def test_404(request):
    raise Http404("页面不存在")