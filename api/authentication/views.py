from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from rest_framework.decorators import api_view
import os

PARENT_DIR = "./files"

def CurrentUser(request):
    if not request.user.is_authenticated:
        return None
    return request.user

@api_view(['GET'])
def GetDetails(request):
    if request.method == 'GET':
        usr = CurrentUser(request)
        if usr == None:
            return Response({"success":True, "loggedin": False}, status=status.HTTP_200_OK)
        return Response({"success":True, "loggedin": True, **dict(UserSerializer(usr).data)})
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def RegisterUser(request):
    if request.method == 'POST':
        form = UserCreationForm(request.data)
        if form.is_valid():
            form.save()
            uname = form.cleaned_data.get('username')
            pwd = form.cleaned_data.get('password1')
            user = authenticate(username=uname, password=pwd)
            logout(request)
            login(request, user)
            os.mkdir(PARENT_DIR + "/" + uname)      # Directory name is same as username
            serializer = UserSerializer(user)
            return Response({"success":True, **dict(serializer.data)})
        return Response({"success":False, "message": "Invalid credentials."}, status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def LoginUser(request):
    if request.method == 'POST':
        logout(request)
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({"success":True, **dict(serializer.data)}, status=status.HTTP_200_OK)
        return Response({"success":False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def LogoutUser(request):
    if request.method == 'GET':
        try :
            logout(request)
            return Response({"success":True, "message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except:
            return Response({"success":False, "message": "Some error occurred. Try again later."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)
