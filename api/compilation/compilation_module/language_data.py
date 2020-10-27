INTERPRETED = ["python", "python3"]
COMPILED = ["c++", "c"]
EXTENSIONS = {"c++":".cpp", "c":".c", "python": ".pY", "python3":".py"}

COMPILATION_COMMAND = {"c++": "g++ -std=c++14 -o2 {0} -o {1}", "c": "gcc {0} -o {1}"}

RUN_COMMAND = {"c++": "./{0} ", "c": "./{0} ", "python":"python {0} ", "python3":"python3 {0}"}