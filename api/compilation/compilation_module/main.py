import subprocess, os
import string 
import random 
from .language_data import COMPILATION_COMMAND, INTERPRETED, COMPILED, EXTENSIONS, RUN_COMMAND

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def get_output(config):

	input_data = config["input"] 
	command_data = config["command"]
	filename = config['filename']
	user = config['username']
	filepath = config['relative_path']
	code_file = filepath + filename

	temp_length = 7
	exec_file = get_random_string(temp_length)
	input_file = get_random_string(temp_length)

	exec_file = filepath + exec_file + ".out"

	with open(input_file, "w") as f:
		f.write(input_data)

	if config["lang"] in COMPILED:
		compilation_output = subprocess.run(COMPILATION_COMMAND[config["lang"]].format(code_file, exec_file), stderr = subprocess.STDOUT, stdout=subprocess.PIPE)
		if len(compilation_output.stdout) > 0:
			os.remove(input_file)
			return False, compilation_output.stdout.decode("utf-8")

	run_command = RUN_COMMAND[config["lang"]].format(exec_file) + command_data
	script = "sudo ./run.sh '" + run_command + "' " + str(user)

	with open(input_file, "r") as input:
		run_output = subprocess.run(script, stdin=input_file, stderr = subprocess.STDOUT, stdout=subprocess.PIPE)

	os.remove(input_file)
	os.remove(exec_file)

	return True, run_output.stdout.decode("utf-8")