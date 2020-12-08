INTERPRETED = ["python", "python3", "sh"]
COMPILED = ["c++", "c", "haskell"]
EXTENSIONS = {"c++":".cpp", "c":".c", "python": ".pY", "python3":".py", "sh": ".sh", "haskell": ".hs"}

COMPILATION_COMMAND = {"c++": "g++ -std=c++14 -o2 {0} -o {1}", "c": "gcc {0} -o {1}", "haskell": "ghc -v0 {0} -o {1}"}

RUN_COMMAND = {"c++": "./{0} ", "c": "./{0} ", "python":"python {0} ", "python3":"python3 {0}", "sh": "bash {0}", "haskell": "./{0}"}