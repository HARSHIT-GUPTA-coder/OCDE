from django.db import models
from django.conf import settings

class Statement(models.Model) :
    problem_id = models.AutoField(primary_key=True)
    statement_name = models.CharField(max_length=10000)
    languages = models.CharField(max_length=10000)
    memory_limit = models.CharField(max_length=10000)
    time_limit = models.CharField(max_length=10000)