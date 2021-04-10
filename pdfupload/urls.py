from .import views
from django.urls import path,include

urlpatterns = [
    path('merge/',views.simple_upload,name="simple_upload"),
    path('merge/<str:randomlink>/',views.make_download,name="make_download")
]
