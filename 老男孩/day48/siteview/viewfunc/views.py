from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
def login(request):
    print('_' * 60)
    print(request.method)
    print(request.path)
    print(request.get_full_path())
    print(request.GET)
    print(request.POST)
    print(request.META)
    # return HttpResponse('200 ok')

    if request.method == 'GET':
        return render(request, 'login.html')
    else:
        uname = request.POST.get('username')
        if uname == 'lyh':
            return redirect('/home/')
def home(request):
    return render(request, 'home.html')
