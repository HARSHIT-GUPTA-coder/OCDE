import subprocess, os
import string 
import random 
from .language_data import COMPILATION_COMMAND, INTERPRETED, COMPILED, EXTENSIONS, RUN_COMMAND

def get_random_string(length):
	letters = string.ascii_lowercase
	result_str = ''.join(random.choice(letters) for i in range(length))
	return result_str

def get_status(config):
	filename = config['filename']
	filepath = config['relative_path']
	time_limit = int(config['time_limit'])
	code_file = 'files/' + config["username"]  +  filepath + filename

	problem = str(config['problem_id'])
	testcase_dir = "competing/testcases/" + problem + "/"

	total_list = list(set([x.split(".")[0] for x in os.listdir(testcase_dir)]))

	temp_length = 7
	exec_file = get_random_string(temp_length)

	exec_file = 'temp/' + exec_file + ".out"

	compilation_error = False 
	compilation_message = ""
	if config["lang"] in COMPILED:
		command = COMPILATION_COMMAND[config["lang"]].format(code_file, exec_file).split()

		try:
			compilation_output = subprocess.run(command, stderr = subprocess.STDOUT, stdout=subprocess.PIPE)
		except subprocess.TimeoutExpired:
			compilation_error = 1 
			compilation_message = "Timed out while compiling!"

		if len(compilation_output.stdout) > 0:
			print(compilation_output.stdout)
			compilation_message = "Compilation error!"
			compilation_error = 1
		
		output_name = exec_file 
	else:
		output_name = code_file

	if compilation_error:
		return {"passed": False, "message": compilation_message}
	run_command = RUN_COMMAND[config["lang"]].format(output_name) 
	# script = "sudo ./compile.sh '" + run_command + "' " + str(user)
	script = run_command 

	passed = 0
	total = len(total_list)
	timeout = False

	for f in total_list:
		file_loc = open(testcase_dir + f + ".in", "r")

		try:
			run_output = subprocess.run(script.split(), stdin=file_loc, stderr = subprocess.STDOUT, stdout=subprocess.PIPE, timeout=time_limit)
			run_output = run_output.stdout.decode("utf-8").strip()

			with open(testcase_dir + f + ".out", "r") as cur_file:
				correct = cur_file.read().strip()

			if correct == run_output:
				passed += 1

		except subprocess.TimeoutExpired:
			timeout = True
			break

	if output_name == exec_file:
		os.remove(exec_file)

	if timeout:
		return {"passed": False, "message": "Time Limit Exceeded"} 
	elif passed == total:
		return {"passed": True, "message": "Accepted: {0}/{0} testcases correct".format(total)}
	else:
		return {"passed": False, "message": "Wrong Answer on {0}/{1} testcases".format(total-passed, total)}
	