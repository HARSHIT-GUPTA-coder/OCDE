import subprocess, os
import string 
import random 
from .language_data import COMPILATION_COMMAND, INTERPRETED, COMPILED, EXTENSIONS, RUN_COMMAND

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def get_output(config):
	if config["type"]=="TEXT":
		code = config["code"] 
	else:
		with open(config["code"], "r") as f:
			code = f.read()

	if config["input_type"] == "TEXT":
		input_data = config["input"] 
	else:
		with open(config["input"], "r") as f:
			input_data = f.read()

	temp_length = 7
	temp_name = get_random_string(temp_length)
	temp_input_file = get_random_string(temp_length)


	temp_name_total = temp_name + EXTENSIONS[config["lang"]]
	out_name = temp_name + ".out"

	with open(temp_name_total, "w") as f:
		f.write(code)

	with open(temp_input_file, "w") as f:
		f.write(input_data)

	if config["lang"] in COMPILED:
		compilation_output = subprocess.run(COMPILATION_COMMAND[config["lang"]].format(temp_name_total, out_name).split() + config["args"].split(), stdout=subprocess.PIPE)
		os.remove(temp_name_total)

		temp_name_total = out_name 


	run_command = RUN_COMMAND[config["lang"]].format(temp_name_total).split() + (config["args"].split() if config["lang"] not in COMPILED else [])

	input_file = open(temp_input_file, "r")
	run_output = subprocess.run(run_command, stdin=input_file, stdout=subprocess.PIPE)


	input_file.close()
	os.remove(temp_input_file)
	os.remove(temp_name_total)


	return run_output.stdout.decode("utf-8")


