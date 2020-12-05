from .views import *
from django.urls import path

urlpatterns = [
    path('create-file/', CreateFile),
    path('get-structure/', GetStructure),
    path('read-file/', ReadFile),
    path('delete-file/', DeleteFile),
    path('update-file/', UpdateFile),
    path('get-folders/', GetFolders),
]
