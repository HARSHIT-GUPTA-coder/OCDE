# OCDE

OCDE is a cloud based programming environment and IDE that allows users to execute code on the server. Frontend is written in Angular and the backend API is handled by Django REST Framework.

This Project is done as the Course Project for CS 251: Software Systems Lab IIT Bombay.

## Build Instructions

The project has two components, an Angular based front end and a Django based backend. Both the backend and frontend need setup. Please follow the instructions given below:

### Backend

Firstly move to the api directory and run the following command to set up the filesystem and setup the shell scripts. 
```
sudo mkdir temp files files2 && chmod +x *.sh
```

The shell scripts are used to run the Isolation framework on the backend. This system works perfeclty on a Linux server and WSL/Mac currently do not support Isolation. Isolation can be switched on/off by changing the Isolation variable in the backend.

Start the server by the command:
```
sudo python manage.py runserver
```
Only Python 3.6+ is supported.

### Frontend

Move to the frontend directory and run the following command to install node modules:

```
npm install -i
```

After this the build can commence using:

```
ng build
```

To serve the site use:
```
ng serve
```

You can change the API endpoints by changing the `API.ts` file in the frontend directory

### License

All work is MIT Licensed.
Created by Pradipta Bora, Harshit Gupta, Ankit Kumar Jain and Vibhav Aggarwal.