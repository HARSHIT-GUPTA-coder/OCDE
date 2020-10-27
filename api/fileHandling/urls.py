from .views import UploadFile
from django.urls import path

urlpatterns = [
    path('upload_file/', UploadFile),
]
