from django.shortcuts import render
from app01 import models
# Create your views here.
def books(request):
    book_lst = models.Book.objects.all()
    return render(request, 'books.html', {'book_lst': book_lst})

def add_book(request):
    
    return render(request, 'add_book.html')