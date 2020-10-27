from django.urls import path, include
# from authentication import views
from .views import *

urlpatterns = [
    path('register/', RegisterUser),
    path('login/', LoginUser),
    path('logout/', LogoutUser),
]
