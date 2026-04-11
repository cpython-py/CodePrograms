from django.urls import path

from App import views

urlpatterns = [
    path('index', views.index, name='index'),
    path('show', views.show, name='show'),
    path('html', views.html, name='html'),
    path('json', views.json, name='json'),
    path('json2', views.json2, name='json2'),
    path('red', views.red, name='red'),
    path('baidu', views.baidu, name='baidu'),
    path('rev', views.rev, name='rev'),
    path('test404', views.test_404, name='test_404'),
]