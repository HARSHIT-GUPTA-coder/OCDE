from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from fileHandling.models import File
from django.contrib.auth.models import User
from .compilation_module import get_output
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def compilation_view(request):
	if request.method == "GET":
		return Response({"success":False, "output": "Please do a POST request"})
	else:
		data = request.data
		print (data)
		fid = data['file_id']
		file = File.objects.filter(file_id = fid, owner = request.user)
		if file.exists():
			file = file[0]
			data['relative_path'] = file.relative_location
			data['filename'] = file.filename
			data['username'] = file.owner.username
			status, output = get_output(data)
			return Response({"success":status, "output": output})
			
		return Response({"success":False, "message": "File does not belong to user"}, status=status.HTTP_400_BAD_REQUEST)