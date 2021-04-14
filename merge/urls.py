from .import views
from django.urls import path,include

urlpatterns = [
    path('merge/',views.merge,name="merge"),
]
