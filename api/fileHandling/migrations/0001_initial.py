# Generated by Django 3.0.7 on 2020-10-27 14:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('file_id', models.AutoField(primary_key=True, serialize=False)),
                ('filename', models.CharField(max_length=1000)),
                ('relative_location', models.CharField(max_length=2000)),
                ('is_file', models.BooleanField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
