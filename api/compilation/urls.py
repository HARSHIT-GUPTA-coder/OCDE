from django.urls import path
from compilation import views

urlpatterns = [
    path('', views.compilation_view),
]