from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index_0(request):
    res = render(request, 'index.html')
# def index(request, year, month):
#     print(year, month)
    # return HttpResponse('%s年 %s月所有记录都在这' % (year, month))
# def index2(request, year):
#     return HttpResponse('%s年所有记录都在这' % (year,))
def index3(request, year, month):
    return HttpResponse('{}-{}所有记录都在这'.format(year, month))