from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from rest_framework.decorators import api_view

@api_view(['POST'])
def RegisterUser(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            uname = form.cleaned_data.get('username')
            pwd = form.cleaned_data.get('password')
            user = authenticate(username=uname, password=pwd)
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials."}, status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response({"message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def LoginUser(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def LogoutUser(request):
    if request.method == 'GET':
        try :
            logout(request)
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Some error occurred. Try again later."}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)
