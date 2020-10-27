from django.db import models
from django.conf import settings

class File(models.Model) :
    # Assuming that the file location is api/files/username/dir1/dir2/file.txt
    file_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    filename = models.CharField(max_length = 1000)                  # file.txt
    relative_location = models.CharField(max_length = 2000)         # 'dir1/dir2/'
    is_file = models.BooleanField()                                 # true means it is a file, otherwise it is a directory