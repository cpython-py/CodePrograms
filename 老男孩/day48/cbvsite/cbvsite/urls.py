"""cbvsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from cbv import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # url(r'^book/', views.BookView.as_view()),
    #TODO
    url(r'^index2/', views.index2),
    url(r'^t1/', views.t1),
    url(r'^t2/', views.t2),
    url(r'^t3/', views.t3),
    url(r'^zhujian/', views.zhujian),
    url(r'^tan/', views.tan),
    url(r'^zujian/', views.zujian),
    # url(r'^home/', views.home)

]
