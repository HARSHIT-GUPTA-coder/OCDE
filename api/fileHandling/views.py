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

# Make a post request with 'data' containing file data and 'filename' containing filename and 'parent' conatining fileID of parent and is_file containing true or false depending on type.
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def CreateFile(request):
    if request.method == 'POST':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        filetext = request.data.get('data', '')
        filename = request.data.get('filename', '')
        parent = request.data.get('parent', -1)
        is_file = request.data.get('is_file', 'true')
        is_file = is_file.lower()
        relative_path = '/'

        try:
            parent = int(parent)
        except:
            return Response({"success":False, "message": "Invalid parent ID"}, status=status.HTTP_400_BAD_REQUEST)

        if parent != -1:
            parent_file = File.objects.filter(file_id = parent)

            if parent_file.exists():
                parent_file = parent_file[0]
                if parent_file.owner == usr and not parent_file.is_file:
                    relative_path = parent_file.relative_location + parent_file.filename + "/"
                else:
                    return Response({"success":False, "message": "Invalid parent ID"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"success":False, "message": "Invalid parent ID"}, status=status.HTTP_400_BAD_REQUEST)


        if filename == '':
            return Response({"success":False, "message": "Invalid filename"}, status=status.HTTP_400_BAD_REQUEST)
        
        if is_file == '0': is_file = 'false'
        if is_file == '1': is_file = 'true'

        if is_file != 'true' and is_file != 'false':
            return Response({"success":False, "message": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        filepath = PARENT_DIR + "/" + usr.username + relative_path + filename

        if os.path.exists(filepath):
            return Response({"success":False, "message": "File already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        if is_file == 'true':
            f = open(filepath, "w+")
            f.write(filetext)
            f.close()
            file_size = os.stat(filepath).st_size
            new_file = File.objects.create(owner = usr, filename = filename, relative_location = relative_path, is_file = True, parent = parent, children = [], size = file_size)
            if parent != -1:
                parent_file.children += [new_file.file_id]
                parent_file.save()
        else:
            os.mkdir(filepath + '/')
            new_file = File.objects.create(owner = usr, filename = filename, relative_location = relative_path, is_file = False, parent = parent, children = [])
            if parent != -1:
                parent_file.children += [new_file.file_id]
                parent_file.save()

        
        return Response({"success":True, "message": "Created Successfully", "file_id": new_file.file_id}, status=status.HTTP_200_OK)
    
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

def ReturnDict(fid):
    root_obj = File.objects.get(file_id = fid)
    if root_obj.is_file:
        return {"data": { "name": root_obj.filename, "size": root_obj.size, "is_file": True, "id": fid }}
    
    num_children = 0
    total_size = 0
    return_dict = {"data": { "name": root_obj.filename, "size": 0, "items": 0, "is_file": False, "id": fid }, "children": []}
    for cid in root_obj.children:
        child = ReturnDict(cid)
        return_dict["children"] += [child]
        total_size += child["data"]["size"]
        num_children += 1
    
    return_dict["data"]["items"] = num_children
    return_dict["data"]["size"] = total_size
    return return_dict


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetStructure(request):
    if request.method == 'GET':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        user_files = File.objects.filter(owner = usr, parent = -1)

        return_list = []

        for f in user_files:
            return_list += [ReturnDict(f.file_id)]
                
        return Response({"success":True, "structure": return_list}, status=status.HTTP_200_OK)
    
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)