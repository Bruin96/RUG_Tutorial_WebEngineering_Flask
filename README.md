# Flask Tutorial

This repository describes a basic tutorial for getting started with Flask that was given during the course Web Engineering at the University of Groningen. The code is made available publicly so that students can use the demo program to try out Flask and see if it is a framework they would want to work with. This code has not been tested enough to be used directly in professional settings without extensive modifications. Furthermore, his tutorial will leave out some setup steps that would be important in professional implementations. 

## How to setup a basic Flask server

Setting up a simple Flask server is very easy. In the demo code, you can find the following files: firstly, the file server.py in the main demo\_code directory; and secondly, the file \_\_init\_\_.py in the demo\_code/app directory. When those two files are configured properly, we will already have constructed a running Flask server! The file server.py is a very simple wrapper for executing the Flask server configured in \_\_init\_\_.py. server.py contains the following code:

```
from flask import Flask

from app import app

if __name__ == "__main__":
	app.run(host="0.0.0.0") # Remember: Multithreaded by default!
```

The code imports the Flask object from the flask library in order to work with the Flask commands. Then, it imports the app object that was created in the \_\_init\_\_.py file. After that, it simply acts as the main function, and calls `app.run()` in order to start the Flask server.

The second file, \_\_init\_\_.py, handles the logic of initialising the Flask server. It contains the following code:

```
from flask import Flask
from flask_cors import CORS

app = Flask(__name__, template_folder="../frontend", static_folder="../frontend")
app.config['TEMPLATES_AUTO_RELOAD'] = True # Reload if template (frontend) files have changed
cors = CORS(app) # Enable Cross-Origin resource sharing

from app import routes
```

Once again, we import the Flask object from the flask library. This time, we also import the CORS object from the flask_cors library, which will allow our app to perform Cross-Origin resource sharing (the ability to access resources from different origins). Besides this CORS configuration, the app is configured such that it will dispatch the frontend files whenever the frontend (HTML/CSS/JS) files are altered. This way, any changes to the frontend will be served by our server to the clients.
