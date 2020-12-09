from app import app

from flask import render_template, jsonify, json, request, Response, make_response
import requests  # Allows for the use of GET, POST, UPDATE, DELETE requests
import os
from http import HTTPStatus

@app.route("/")
def render_home():
    return render_template("demo_page.html")
    
    
@app.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    request_string = "https://api.github.com/users/" + str(user_id)
    result = requests.get(request_string)
    
    return create_response(result)


@app.route("/users/<user_id>/repos/<repo_name>", methods=["GET"])
def get_repository(user_id, repo_name):
    request_string = "https://api.github.com/repos/" + str(user_id) + "/" + str(repo_name)
    result = requests.get(request_string)
    
    return create_response(result)
    

@app.route("/users/<user_id>/count-repos", methods=["POST"])    
def count_repos(user_id):
    request_string = "https://api.github.com/users/" + str(user_id) + "/repos?per_page=100" # Default is 30 entries, but there may be more. Github sets the maximum at 100.
    result = requests.get(request_string)
    
    num_repos = len(result.json())
    while 'link' in result.headers: # Go to next result page if num_repos > 100
        (has_next, next_link) = parse_link(result.headers['link'])
        if not has_next: # link is to previous page, not to a next page
            break;
        result = requests.get(next_link)
        num_repos = num_repos + len(result.json())
        
    response_data = {"number_of_repos": num_repos}
    
    if result.status_code == HTTPStatus.NOT_FOUND:
        response = create_response(result)
    else:
        response = make_response(jsonify(response_data), HTTPStatus.OK)
        
    return response


@app.route("users/<user_id>/get-n-repos-alphabetically", methods=["POST"])
def get_n_repos(user_id):
    data = request.get_json()
    if not "num_repos" in data:
        return make_response(jsonify({"message" : " Number of repositories was not specified."}), HTTPStatus.BAD_REQUEST)
        
    num_repos = int(data["num_repos"])
    
    request_string = "https://api.github.com/users/" + str(user_id) + "/repos?per_page=100"
    
    result = requests.get(request_string)
    
    repo_names = []
    
    for res in result.json():
        repo_names.append(res["name"])
        if len(repo_names) == num_repos:
            break
            
    return make_response(jsonify({"repo_names": repo_names}), HTTPStatus.OK)
    

    
def create_response(request):
    response = ""
    if request.status_code == HTTPStatus.NOT_FOUND:
        response = make_response(jsonify({"message": "The requested URL could not be found. Please make sure the repository or user exists."}), request.status_code)
    else:
        response = make_response(request.json())
    response.headers["Content-Type"] = "application/json"
    
    return response


def parse_link(link_string):    
    i = 1
    next_link = ""
    while link_string[i] != ">":
        next_link += link_string[i]
        i += 1
    
    i += 3
    
    type_string = ""
    while link_string[i] != ",":
        type_string += link_string[i]
        i += 1
        
    has_next = False
    if type_string == "rel=\"next\"":
        has_next = True
    
    return (has_next, next_link)
