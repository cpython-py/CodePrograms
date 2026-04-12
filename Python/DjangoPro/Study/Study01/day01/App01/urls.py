from django.urls import path, re_path

from App01 import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('show/<int:age>/', views.show, name='show'), # int
    path('list/<slug:name>/', views.list, name='list'), # slug
    path('access/<path:path>/', views.access, name='access'), # path必须再最后一个
    re_path(r'^tel/(?P<phone>1\d{10})/?$', views.get_phone, name='phone'),
]