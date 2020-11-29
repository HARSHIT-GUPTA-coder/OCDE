from django.urls import path, include
# from authentication import views
from .views import RegisterUser, LoginUser, LogoutUser, GetDetails
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', RegisterUser),
    path('login/', LoginUser),
    path('logout/', LogoutUser),
    path('get_basic_details/', GetDetails),
]
