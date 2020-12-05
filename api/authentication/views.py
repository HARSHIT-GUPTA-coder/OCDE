from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.db import models
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
import os

PARENT_DIR = "./files"

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(max_length=254, required = False)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name')

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.username = self.cleaned_data['username']
        if commit:
            user.save()
        return user

def CurrentUser(request):
    if not request.user.is_authenticated:
        return None
    return request.user

@api_view(['GET'])
@permission_classes(())
@authentication_classes(())
def GetDetails(request):
    if request.method == 'GET':
        usr = CurrentUser(request)
        if usr == None:
            return Response({"success":True, "loggedin": False}, status=status.HTTP_200_OK)
        return Response({"success":True, "loggedin": True, **dict(UserSerializer(usr).data)})
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes(())
@authentication_classes(())
def RegisterUser(request):
    if request.method == 'POST':
        form = SignUpForm(request.data)
        if form.is_valid():
            try:
                uname = form.cleaned_data.get('username')
                pwd = form.cleaned_data.get('password1')
                print(uname)
                os.mkdir(PARENT_DIR + "/" + uname)      # Directory name is same as username
                print("b")
                form.save()
                user = authenticate(username=uname, password=pwd)
                print("c")
                try:
                    request.user.auth_token.delete()
                except:
                    pass
                token, _ = Token.objects.get_or_create(user=user)
                print("d")
                serializer = UserSerializer(user)
                return Response({"success":True, 'token': token.key, **dict(serializer.data)})
            except:
                return Response({"success":False, "message": "Try Again.", "errors": form.errors.as_json()}, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({"success":False, "message": "Invalid credentials.", "errors": form.errors.as_json()}, status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes(())
@authentication_classes(())
def LoginUser(request):
    if request.method == 'POST':
        try:
            request.user.auth_token.delete()
        except:
            pass
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:

            token, _ = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({"success":True, 'token': token.key, **dict(serializer.data)}, status=status.HTTP_200_OK)
        return Response({"success":False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes(())
@authentication_classes(())
def LogoutUser(request):
    if request.method == 'GET':
        user = CurrentUser(request)
        
        if user is not None:
            try :
                request.user.auth_token.delete()
            except:
                return Response({"success":False, "message": "Some error occurred. Try again later."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"success":True, "message": "Successfully logged out."}, status=status.HTTP_200_OK)
    
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)
