from django.db import models
from django.conf import settings

class Contest(models.Model):
    contest_id = models.AutoField(primary_key=True)
    contest_name = models.CharField(max_length=10000)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

class Statement(models.Model) :
    problem_id = models.AutoField(primary_key=True)
    statement_name = models.CharField(max_length=10000)
    languages = models.CharField(max_length=10000)
    memory_limit = models.CharField(max_length=10000)
    time_limit = models.CharField(max_length=10000) 
    contest = models.ForeignKey(Contest, null=True, blank=True, default=None, on_delete=models.CASCADE)
    total_submissions = models.IntegerField(default=0)
    accepted = models.IntegerField(default=0)

class Submissions(models.Model):
    user =  models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey(Statement, on_delete = models.CASCADE)
    passed = models.BooleanField()
    message = models.CharField(max_length=10000)
    submission_id = models.AutoField(primary_key=True)
    time = models.DateTimeField()
    
class Scores(models.Model):
    user =  models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey(Statement, on_delete = models.CASCADE)
    score_id = models.AutoField(primary_key=True)
    score = models.IntegerField()

class ContestScore(models.Model):
    user =  models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contest  = models.ForeignKey(Contest, on_delete = models.CASCADE)
    score = models.IntegerField()
    cscore_id = models.AutoField(primary_key=True)


    
