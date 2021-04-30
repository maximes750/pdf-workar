from django.shortcuts import render,redirect
from django.conf import settings

# Create your views here.
def home(request):
    return render(request,'navigation/home.html',settings.SITE_WHOLE_ADDRESS)

def service(request):
    return render(request,'navigation/service.html',settings.SITE_WHOLE_ADDRESS)