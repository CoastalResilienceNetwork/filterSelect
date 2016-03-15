import os
import json
bdic = {}
for file in os.listdir(r"D:\projects\TNC\devcr\app\plugins\filterSelect\resources\images"):
    fpart = file.split(".")
    fparts = fpart[0]
    if (fparts.isdigit()):
        dk = fparts
    else:
        dk = fparts[:-1]
    if dk in bdic:
        bdic[dk].append(file)
    else:
        bdic[dk] = [file]

print json.dumps(bdic, sort_keys=True)
        
