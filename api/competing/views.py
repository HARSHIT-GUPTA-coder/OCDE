from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.db import models
from django.core import serializers
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from fileHandling.models import File
import os, subprocess
from .models import Statement, Submissions, Scores
from .tester import get_status
import datetime

def CurrentUser(request):
    if not request.user.is_authenticated:
        return None
    return request.user

# Create your views here.
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_statements(request):
    objects = Statement.objects.all()
    return_list = []

    for obj in objects:
        return_list.append({"id" : obj.problem_id, "Problem Name": obj.statement_name, "Time Limit": obj.time_limit, "Memory Limit": obj.memory_limit})

    return_list = [{"data":x} for x in return_list]
    return Response({"success":True, "problems": return_list}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def get_problem(request):
    objects = Statement.objects.filter(problem_id=request.data.get('id', -1))
    data = {}

    for obj in objects:
        data["id"] =  obj.problem_id 
        data["name"] = obj.statement_name
        with open("competing/statements/" + str(obj.problem_id) + ".tex", "r") as f:
            data["statement"] = f.read()
        data["memory_limit"] = obj.memory_limit
        data["time_limit"] = obj.time_limit

    return Response({"success":True, "problem": data}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def submit_problem(request):
    usr = CurrentUser(request)
    data = request.data
    file_id = request.data.get('file_id')
    problem_id= request.data.get('problem_id', -1)
    problem = Statement.objects.filter(problem_id = problem_id)[0]
    data['time_limit'] = problem.time_limit

    file = File.objects.filter(file_id = file_id)
    if file.exists():
        file = file[0]
        data['relative_path'] = file.relative_location
        data['filename'] = file.filename
        data['username'] = file.owner.username

    status = get_status(data)

    if status["passed"]:
        score = 100
    else:
        score = -50 
    
    obj = Scores.objects.filter(problem=problem, user=usr)
    if len(obj):
        obj = obj[0]
        obj.score += score 
        obj.save()
    else:
        new_inst = Scores.objects.create(user=usr, problem=problem, score=score)
    new_submission = Submissions.objects.create(user = usr, problem=problem, passed = status["passed"], message = status["message"], time = datetime.datetime.now())
    return Response({"success":True, "status": status}) 

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def get_submissions(request):
    usr = CurrentUser(request)
    problem_id = request.data.get('problem_id', -1) 
    problem = Statement.objects.filter(problem_id = problem_id)[0]
    submissions = Submissions.objects.filter(user=usr, problem=problem)
    result = [{"data":{"Passed": "Yes" if x.passed else "No", "Status": x.message, "Time": x.time.strftime("%m/%d/%Y, %H:%M:%S")}} for x in submissions]
    result.reverse()
    return Response({"success": True, "submissions": result}) 

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def get_scores(request):
    problem_id = request.data.get('problem_id', -1) 
    problem = Statement.objects.filter(problem_id = problem_id)[0]
    
    scores = Scores.objects.filter(problem=problem)
    result = [{"data":{"Name": str(x.user), "Score":x.score}} for x in scores]
    result.sort(reverse=True, key = lambda x: x["data"]["Score"])
    return Response({"success": True, "scores": result})
