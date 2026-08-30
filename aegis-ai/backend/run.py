import sys
import os

# Ensure user site-packages is in sys.path
user_site = os.path.expanduser(r"~\AppData\Roaming\Python\Python314\site-packages")
if user_site not in sys.path and os.path.exists(user_site):
    sys.path.insert(0, user_site)

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, log_level="info", reload=False)

