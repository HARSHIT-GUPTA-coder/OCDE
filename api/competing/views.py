from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.db import models
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import os, subprocess
from .models import Statement

# Create your views here.
@api_view(['GET'])
@authentication_classes(())
@permission_classes(())
def get_statements(request):
    objects = Statement.objects.all()
    return_list = []

    for obj in objects:
        return_list.append({"id" : obj.problem_id, "name": obj.statement_name})

    return Response({"success":True, "problems": return_list}, status=status.HTTP_200_OK) 

@api_view(['POST'])
@authentication_classes(())
@permission_classes(())
def get_problem(request):
    print(request.data)
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


