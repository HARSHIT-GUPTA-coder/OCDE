from authentication.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import os
from .models import File
from django.contrib.auth.models import User

PARENT_DIR = "./files"
BLACKLIST = ['/', '\\', ':', '*', '?', '"', '<', '>', '|', "'"]

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
        is_file = str(request.data.get('is_file', 'true'))
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
        
        if 1 in [c in filename for c in BLACKLIST]:
            return Response({"success":False, "message": "Filename cannot contain special characters"}, status=status.HTTP_400_BAD_REQUEST)

        if is_file == '0': is_file = 'false'
        if is_file == '1': is_file = 'true'

        if is_file != 'true' and is_file != 'false':
            return Response({"success":False, "message": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        filepath = PARENT_DIR + "/" + usr.username + relative_path + filename

        if os.path.exists(filepath):
            return Response({"success":False, "message": "File already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        file_size = 0
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

        return Response({"success":True, "message": "Created Successfully", "file_id": new_file.file_id, "size": file_size}, status=status.HTTP_200_OK)
    
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

# GET requests contains file_id
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def ReadFile(request):
    if request.method == 'POST':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        fid = request.data.get('file_id', -1)
        try:
            fid = int(fid)
        except:
            return Response({"success":False, "message": "file_id must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        requested_file = File.objects.filter(owner = usr, file_id = fid)

        if requested_file.exists():
            requested_file = requested_file[0]
            if not requested_file.is_file:
                return Response({"success":False, "message": "Can't read a folder"}, status=status.HTTP_400_BAD_REQUEST)
            
            f = open(PARENT_DIR + "/" + usr.username + requested_file.relative_location + requested_file.filename, 'r')
            data = f.read()
            f.close()

            return Response({"success":True, "data": data, "filename": requested_file.filename}, status=status.HTTP_200_OK)
        else:
            return Response({"success":False, "message": "Requested file does not belong to user"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)

def RecursiveDelete(fid, rel_path):
    try:
        f = File.objects.get(file_id = fid)
        if f.is_file:
            os.remove(rel_path + f.relative_location + f.filename)
            f.delete()
        else:
            for c in f.children:
                RecursiveDelete(c, rel_path)
            f.delete()
            os.rmdir(rel_path + f.relative_location + f.filename)
    except:
        pass

# POST requests contains file_id
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def DeleteFile(request):
    if request.method == 'POST':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        fid = request.data.get('file_id', -1)
        try:
            fid = int(fid)
        except:
            return Response({"success":False, "message": "file_id must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        requested_file = File.objects.filter(owner = usr, file_id = fid)

        if requested_file.exists():
            pid = requested_file[0].parent
            if pid != -1:
                parent = File.objects.get(file_id = pid)
                parent.children.remove(fid)
                parent.save()
            RecursiveDelete(fid, PARENT_DIR + "/" + usr.username)
            return Response({"success":True, "message": "Deleted Successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"success":False, "message": "Requested file does not belong to user"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

def RecursiveRename(fid, par_location):
    try:
        f = File.objects.get(file_id = fid)
        f.relative_location = par_location
        f.save()
        if not f.is_file:
            for c in f.children:
                RecursiveRename(c, par_location + f.filename + '/')
    except:
        pass

# POST requests contains file_id, filename, data
# If filename or data is absent, they will not be updated, otherwise they will be overwritten
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def UpdateFile(request):
    if request.method == 'POST':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        fid = request.data.get('file_id', -1)
        filename = request.data.get('filename', -1)
        data = request.data.get('data', -1)

        try:
            fid = int(fid)
        except:
            return Response({"success":False, "message": "file_id must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        requested_file = File.objects.filter(owner = usr, file_id = fid)

        if requested_file.exists():
            requested_file = requested_file[0]
            file_size = requested_file.size

            filepath = PARENT_DIR + "/" + usr.username + requested_file.relative_location

            if filename != -1:
                if requested_file.filename != filename and filename != '':
                    if 1 in [c in filename for c in BLACKLIST]:
                        return Response({"success":False, "message": "Filename cannot contain special characters"}, status=status.HTTP_400_BAD_REQUEST)

                    if os.path.exists(filepath + filename):
                        return Response({"success":False, "message": "File already exists in the same directory"}, status=status.HTTP_400_BAD_REQUEST)
                    os.rename(filepath + requested_file.filename, filepath + filename)
                    requested_file.filename = filename
                    requested_file.save()
                    if not requested_file.is_file:
                        for c in requested_file.children:
                            RecursiveRename(c, requested_file.relative_location + requested_file.filename + '/')

            if data != -1:
                filepath += requested_file.filename
                with open(filepath, 'w') as f:
                    f.write(data)
                file_size = os.stat(filepath).st_size
                requested_file.size = file_size
                requested_file.save()

            return Response({"success":True, "size": file_size, "message": "Updated Successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"success":False, "message": "Requested file does not belong to user"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"success":False, "message": "Make a POST request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetFolders(request):
    if request.method == 'GET':
        usr = CurrentUser(request)
        if usr is None:
            return Response({"success": False, "message": "User not logged in."}, status = status.HTTP_403_FORBIDDEN)
        
        user_files = File.objects.filter(owner = usr, is_file = False)

        return_list = []

        for f in user_files:
            return_list += [{"file_id": f.file_id, "filename": f.filename, "relative_location": f.relative_location}]
                
        return Response({"success":True, "data": return_list}, status=status.HTTP_200_OK)
    
    return Response({"success":False, "message": "Make a GET request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetFiles(request):
    usr = CurrentUser(request)

    user_files = File.objects.filter(owner=usr, is_file=True)

    return_list = [{"file_id": x.file_id, "filename": x.filename, "path": x.relative_location} for x in user_files]

    return Response({"success":True, "data": return_list}, status=status.HTTP_200_OK)
