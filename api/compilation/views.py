from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .compilation_module import get_output

@api_view(('GET','POST'))
def compilation_view(request):
	if request.method == "GET":
		return Response({"success":False, "message": "Please do a POST request"})
	else:
		output = get_output(request.data)
		return Response({"success":True, "output": output})

	