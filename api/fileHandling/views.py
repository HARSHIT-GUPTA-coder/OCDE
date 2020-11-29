from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os
from .models import File
from django.contrib.auth.models import User

PARENT_DIR = "./files"

def CurrentUser(request):
    if not request.user.is_authenticated:
        return None
    return request.user

# Make a post request with 'data' containing file data and 'filename' containing filename
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def UploadFile(request):
    if request.method == 'POST':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        filetext = request.data.get('data', '')
        filename = request.data.get('filename', '')

        if filename == '':
            return Response({"success":False, "message": "Invalid filename"}, status=status.HTTP_400_BAD_REQUEST)
        
        filepath = PARENT_DIR + "/" + usr.username + "/" + filename

        if os.path.exists(filepath):
            return Response({"success":False, "message": "File already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        f = open(filepath, "w+")
        f.write(filetext)
        f.close()
        File.objects.create(owner = usr, filename = filename, relative_location = '', is_file = True)
        return Response({"success":True, "message": "Uploaded Successfully"}, status=status.HTTP_200_OK)
    
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)