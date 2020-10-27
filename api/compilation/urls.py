from django.urls import path
from compilation import views

urlpatterns = [
    path('compile/', views.compilation_view),
]