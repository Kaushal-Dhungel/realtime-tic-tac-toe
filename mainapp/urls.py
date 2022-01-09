from django.urls import path
from .views import *

urlpatterns = [
    path('', homeview),
    path('play/<room_code>' , play , name="play")
]