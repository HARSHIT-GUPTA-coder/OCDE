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
from .models import Statement, Submissions, Scores, Contest, ContestScore
from .tester import get_status
import datetime
from django.utils import timezone

def CurrentUser(request):
    if not request.user.is_authenticated:
        return None
    return request.user

# Create your views here.
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_statements(request):
    
    return_list = []
    contest_id=int(request.data.get('contest_id', 0))

    if contest_id == 0:
        objects = Statement.objects.filter(contest=None)
    else:
        cur = Contest.objects.filter(contest_id=contest_id)[0]
        objects = Statement.objects.filter(contest = cur)


    for obj in objects:
        return_list.append({"id" : obj.problem_id, "Problem Name": obj.statement_name, "Accepted Submissions": obj.accepted, "Total Submissions": obj.total_submissions})

    return_list = [{"data":x} for x in return_list]
    return Response({"success":True, "problems": return_list}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_contests(request):
    
    return_list = []

    state = request.data.get("state", "past")
    if state == "past":
        objects = Contest.objects.filter(end_time__lte=datetime.datetime.now())
    else:
        objects = Contest.objects.filter(end_time__gte=datetime.datetime.now(), start_time__lte=datetime.datetime.now())


    for obj in objects:
        return_list.append({"id" : obj.contest_id, "Contest Name": obj.contest_name, "Starting Time": obj.start_time.strftime("%m/%d/%Y, %H:%M:%S"), "Ending Time": obj.end_time.strftime("%m/%d/%Y, %H:%M:%S")})

    return_list = [{"data":x} for x in return_list]
    return Response({"success":True, "contests": return_list}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_contest(request):
    id = request.data.get("id", -1)
    obj = Contest.objects.filter(contest_id=id)[0]

    now = timezone.now()
    ended = False
    
    if now >= obj.start_time and now <= obj.end_time:
        sec = int((obj.end_time - now).total_seconds())
        statuss="r"
    elif now < obj.start_time:
        sec = int((obj.start_time - now).total_seconds())
        statuss = "s"
    else:
        sec = 0
        statuss = "e"
    ret = ({"id" : obj.contest_id, "Contest Name": obj.contest_name, "Starting Time": obj.start_time.strftime("%m/%d/%Y, %H:%M:%S"), "Ending Time": obj.end_time.strftime("%m/%d/%Y, %H:%M:%S"), "status": statuss, "sec": sec})

    return Response({"success":True, "contest": ret}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def get_problem(request):
    objects = Statement.objects.filter(problem_id=request.data.get('id', -1))
    data = {}

    obj = objects[0]
    if obj.contest is not None:
        current_time = timezone.now()
        if current_time < obj.contest.start_time:
            return Response({"success":False, "message": "Contest has not started yet!"}, status=status.HTTP_200_OK) 

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

    finished=False 
    if problem.contest is not None:
        current_time = timezone.now()
        if current_time < problem.contest.start_time:
            return Response({"success":False, "message": "Contest has not started yet!"}, status=status.HTTP_200_OK) 
        if current_time > problem.contest.end_time:
            finished = True

    file = File.objects.filter(file_id = file_id)
    if file.exists():
        file = file[0]
        data['relative_path'] = file.relative_location
        data['filename'] = file.filename
        data['username'] = file.owner.username

    status = get_status(data)

    if status["passed"]:
        if not finished:
            problem.accepted += 1
        score = 100
    else:
        score = -50 

    if not finished:
        problem.total_submissions+=1
    problem.save()
    
    obj = Scores.objects.filter(problem=problem, user=usr)
    previous = 0
    if len(obj) and not finished:
        obj = obj[0]
        previous = obj.score
        obj.score = max(obj.score, score)
        score = obj.score
        obj.save()
    elif not finished:
        new_inst = Scores.objects.create(user=usr, problem=problem, score=score)
    
    if not finished:
        new_submission = Submissions.objects.create(user = usr, problem=problem, passed = status["passed"], message = status["message"], time = datetime.datetime.now())
    
    if not finished and  problem.contest is not None:
        inst = ContestScore.objects.filter(contest = problem.contest, user=usr)
        if len(inst):
            inst = inst[0]
            inst.score += score - previous
            inst.save()
        else:
            new_score_inst = ContestScore.objects.create(contest = problem.contest, user=usr, score=score)
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


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def get_contest_scores(request):
    contest_id = request.data.get('contest_id', -1) 
    contest = Contest.objects.filter(contest_id = contest_id)[0]
    
    scores = ContestScore.objects.filter(contest=contest)
    result = [{"data":{"Name": str(x.user), "Score":x.score}} for x in scores]
    result.sort(reverse=True, key = lambda x: x["data"]["Score"])
    return Response({"success": True, "scores": result})
