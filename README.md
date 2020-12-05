# Flask Tutorial

**DISCLAIMER:**

This repository describes a basic tutorial for getting started with Flask that was given during the course Web Engineering at the University of Groningen. The code is made available publicly so that students can use the demo program to try out Flask and see if it is a framework they would want to work with. This code has not been tested enough to be used directly in professional settings without extensive modifications. Furthermore, his tutorial will leave out some setup steps that would be important in professional implementations. 

The focus of this tutorial is on how the backend works in Flask. You can also use Flask for rendering HTML templates and fill them in inside the Flask framework. I will not go into that in this tutorial, and will instead discuss the backend functionality. The server constructed in this tutorial therefore serves static HTML files instead of dynamically rendered templates. However, note that the webpage is not static, but is made dynamic by JavaScript functionality.

## What is Flask?
Flask is a microframework by The Pallets Projects. It provides a very intuitive basic server setup, and makes it very easy for you to define endpoints, service specific types of requests for those endpoints, and construct and return corresponding responses. We will see in this tutorial that setting up a Flask server takes just over 10 lines of pretty straightforward code. This really shows the power of the abstractions that Flask makes for you. These abstractions also help to make receiving requests and returning responses very easy. In short, Flask is a good point to start developing your first server!

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

## How to serve frontend files
Now that we know how to handle requests and return responses, let us take a look at how you can serve frontend files. In routes.py, we have defined the following endpoint:

```
@app.route("/")
def render_home():
    return render_template("demo_page.html")
```

That is, whenever someone tries to access the home page (`http:0.0.0.0:5000/`), this route is accessed, and the function `render_home()` is called by the framework. This function calls the function `render\_template("demo\_page.html)`, which returns the webpage defined in the HTML file `demo\_page.html`. This function can also work with the templates mentioned in the disclaimer, but in this case we simply use it to render a webpage without using those templates. The function looks for the HTML file in the directory indicated as the `template\_folder` back when we defined the Flask server object. In the demo\_code folder, you will find the frontend folder, and inside of it you can find the HTML page. For this demo, the contents of the HTML file are not very important (but do try the server: it demonstrates the functionality of the server in a web-page format when you access `http://0.0.0.0:5000/`). That is all you need to do to serve web pages. Associated CSS and JavaScript files are automatically loaded into the HTML file and served to the client.

## What Flask does not do
Flask is a microframework. It prides itself on the fact that it provides a basic framework that allows you to extend it easily. As a result, Flask does not provide native support for any type of database, or for any other services. You will need to program the communication with those services yourself. Note, however, that Flask also prides itself in being 'easily extensible.' Indeed, communicating with a database is not hindered in any way by Flask, either: as long as you can reach the address of the database, you can probably make the communication work. As such, Flask makes it easy to get started, and tries to facilitate extensions as well as possible, but the onus of extending the framework lies squarely on the developer.

Another thing that Flask does not have is native support for asynchronous execution. The underlying technology in Werkzeug simply does not have support for it. This has some implications for scalability. Asynchronicity allows for the server to serve multiple requests at the same time, and create future events that it will handle whenever the asynchronous task returns. This decouples the server from the blocking behaviour of many tasks, keeping it available for handling as many incoming requests as possible (up to a reasonable load, of course). Additionally, this behaviour also scales seamlessly to multiple threads of execution. Flask instead only supports multithreading natively. This means that it spins off a new thread for every new request that comes in, which then handles the request from start to finish. This allows the server to process multiple requests at the same time.

What differentiates Flask's approach from native asynchronous execution is that each request always has a thread associated with it. This thread can serve only one request before it is dissolved. As a result, there is no way to introduce asynchronicity across requests. Let's say we make the blocking IO requests asynchronous within the thread (through some Python framework for asynchronous computing). This means that the blocking request is passed off, handled remotely, while the thread continuous its execution. However, this thread is not connected to some pool of incoming requests that it can then go on to serve - it is assumed that it will dissolve after it finishes servicing the request it was assigned to. The consequence is that we have not achieved framework-wide asynchronicity: instead, asynchronicity is completely local to a single request. This somewhat defeats the purpose: while not blocking at an IO request is nice, the thread still will have to wait for the IO to finish before dissolving, and in the meantime it does not move on to the next request but still hogs the resource for the thread. The key thing here is that the thread cannot dissolve until it returns a response. If the response is completely independent of the result of the IO call, then it may be possible to attain good asynchronous performance, but this is not nearly as widely applicable (even DELETE and PUT requests typically want to notify the client if the requested deletion or update resource cannot be found or if the action is not allowed, so even those might depend on the result of the task carried out on the backend).

## Conclusion
Flask is a very easy-to-use microframework that is a good option for smaller projects which you do not expect to be submitted to very large-scale traffic. It is basic, but also easily extensible, allowing you to build the project in the way you want. It also makes it easy to specify request/response lifecycles thanks to the decorators and the library support for easy response construction. If you expect your server to have to scale to large amounts of traffic, then Flask might not be the best solution, due to its inability to achieve pure asynchronicity.
