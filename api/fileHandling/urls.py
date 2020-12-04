from .views import CreateFile, GetStructure
from django.urls import path

urlpatterns = [
    path('create-file/', CreateFile),
    path('get-structure/', GetStructure),
]
