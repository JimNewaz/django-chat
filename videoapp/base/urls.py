from . import views
from django.urls import path

urlpatterns = [
    path('', views.lobby),
    path('room', views.room),
]