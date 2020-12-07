from django.urls import path, include
# from authentication import views
from .views import *

urlpatterns = [
    path('get-problems/', get_statements),
    path('problem/', get_problem),
    path('submit/', submit_problem),
    path('submissions/', get_submissions)
]