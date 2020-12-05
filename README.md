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

Once again, we import the Flask object from the flask library. This time, we also import the CORS object from the flask_cors library, which will allow our app to perform Cross-Origin resource sharing (the ability to access resources from different origins). Besides this CORS configuration, the app is configured such that it will dispatch the frontend files whenever the frontend (HTML/CSS/JS) files are altered. This way, any changes to the frontend will be served by our server to the clients whenever they become available. 

The following line in \_\_init\_\_.py sets up the actual Flask server:

```
app = Flask(__name__, template_folder="../frontend", static_folder="../frontend")
```

This line sets up a Flask object. It also specifies where the static and template files can be found. These files are used for serving the frontend to the user, so the server needs to know where they are. At this point, the Flask server has been configured. Now, we can define endpoints in the routes.py file. At that point, we will have a functioning server that we can send requests to.

## Defining the URI endpoints
The endpoints are defined in the file routes.py. Here another elegant aspect of the Flask microframework reveals itself in the form of the route decorators. An example is given below:

```
@app.route("/users/<user_id>/repos/<repo_name>", methods=["GET"])
def get_repository(user_id, repo_name):
    request_string = "https://api.github.com/repos/" + str(user_id) + "/" + str(repo_name) # Default is 30 entries, but there may be more
    result = requests.get(request_string)
    
    return create_response(result)
```

The decorator starts with an `@` symbol. Then it specifies the Flask object `app` and subsequently defines the route. The route consists of two parts:
1. The URI of the endpoint. Notice that it contains some terms in-between `< >` symbols. These symbols indicate a variable. If you look at the function definition, you can see that those variables are subsequently passed to the associated function.
2. An optional `methods` parameter that specifies the requests that are served by this function. In this example, we define the GET method as an allowed method, and elsewhere we also have an endpoint that allows a POST method. By default, the allowed methods are GET, HEAD, and OPTIONS if the `methods` parameter is not specified.

The Flask decorators are defined immediately above the function which is called for the specified route and method. In the example cited above, you can see this at work: the `@app.route(...)` decorator immediately precedes the function `get_repository`. Thanks to this coupling, the Flask implementation can extract information from the route into the function, so that the function is able to create a response that is subsequently returned to the client that sent a message to this URI. The function `get_repository` has a return statement, which is a Response object. The response is created in the helper function `create_response`, which is defined as follows:

```
def create_response(request):
    response = ""
    if request.status_code == HTTPStatus.NOT_FOUND:
        response = make_response(jsonify({"message": "The requested URL could not be found. Please make sure the repository or user exists."}), request.status_code)
    else:
        response = make_response(request.json())
    response.headers["Content-Type"] = "application/json"
    
    return response
```

The function `make_response` is a function defined in the flask library, and is imported at the top of the routes.py file. This useful utility allows you to specify your response object easily. The general form is `make_response(data, status\_code)`. Data can be specified in a number of different ways, depending on the type of response you want to return. In this case, we return a JSON object. This JSON object is constructed using yet another function from the flask library, namely `jsonify`, which takes a Python dictionary object and turns it into a JSON object. The status code is dependent on the result of the tasks you carried out on the server side (which is a function of some inputs from the client request). In this case, we have two possible outcomes: firstly, the requested Github repository does not exist, so we return a 404 NOT FOUND status code and an accompanying message explaining that the repository could not be found. If the repository does exist, then we return a 200 OK status code and a JSON object with the retrieved information about the repository. We then specify the Content-Type header to be a JSON response, and return the constructed response.

We have now finished the request/response lifecycle: we receive a request, which is routed to the correct function thanks to the decorator specifications. Then, the associated function performs its task in response to that request, and constructs and returns a response object. This response object is then returned to the client by the Flask framework. As a developer, we only needed to define the endpoints in the decorator, create the logic to handle the request, and create a response object. Flask abstracts the details of receiving a request and returning a response from us.


