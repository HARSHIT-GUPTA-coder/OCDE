import subprocess, os
import string 
import random 
from .language_data import COMPILATION_COMMAND, INTERPRETED, COMPILED, EXTENSIONS, RUN_COMMAND

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def get_output(config):

	ISOLATION = True
	input_data = config["input"] 
	command_data = config["command"]
	filename = config['filename']
	user = config['username']
	curr = "."
	filepath1 = curr + '/files/' + str(user) + config['relative_path']
	filepath2 = curr + '/files2/' + str(user) + "/" + str(user) + config['relative_path']
	code_file1 = filepath1 + filename
	code_file2 = "./" + str(user) + config["relative_path"] + filename

	temp_length = 7
	exec_file = get_random_string(temp_length)

	exec_file1 = filepath1 + exec_file + ".out"
	exec_file2 = "./" + str(user) + config["relative_path"] + exec_file + ".out"
	input_file1 = "./files/" + str(user) + "/inp.txt"
	input_file2 = "./inp.txt"
	
	with open(input_file1, "w") as f:
		f.write(input_data)

	if config["lang"] in COMPILED:
		command = COMPILATION_COMMAND[config["lang"]].format(code_file1, exec_file1)
		compilation_output = subprocess.run(command, stderr = subprocess.STDOUT, stdout=subprocess.PIPE, shell=True)
		if len(compilation_output.stdout) > 0:
			os.remove(input_file1)
			return False, compilation_output.stdout.decode("utf-8")

	else:
		exec_file2 = code_file2

	run_command = RUN_COMMAND[config["lang"]].format(exec_file2) + " " + command_data
	if ISOLATION:
		script = "bash ./compile.sh '" + run_command + "' " + str(user)
	else:
		script = "bash ./compile1.sh '" + run_command + "' " + str(user)

	subprocess.run(script, shell=True, timeout=10)

	# os.remove(input_file1)
	if config["lang"] in COMPILED:
		os.remove(exec_file1)

	output_file = "./files2/" + str(user) + "/output.out"

	data = ""
	with open(output_file, "r") as f:
		data = f.read()
		
	# os.remove(output_file)

	return True, data