// Implements the frontend actions and backend communication


user = ""
repo = ""


document.getElementById("user_button").onclick = function() {
    console.log("Executing this function.");
    var user_input = document.getElementById("user_form").elements[0].value;
    console.log(user_input);
    var url = "http://0.0.0.0:5000/users/" + user_input;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            console.log("Request was successful.");
            var error_message = document.getElementById("user_error");
            error_message.style.visibility = "hidden";
            user = user_input;
			var user_query_field = document.getElementById("user_result_form");
            user_query_field.innerHTML = JSON.stringify(response);
		}
        else if (xhr.readyState == 4 && xhr.status == 404) {
            console.log("Request was not successful.");
            var error_message = document.getElementById("user_error");
            error_message.style.visibility = "visible";
            error_message.innerHTML = "The username " + user_input + " could not be found!";
            user = "";
        }
	}
}


document.getElementById("repo_button").onclick = function() {
    console.log("Executing this function.");
    
    if (user == "") {
        var error_message = document.getElementById("repo_error");
        error_message.style.visibility = "visible";
        error_message.innerHTML = "No user has been specified yet!";
        return;
    }
    
    var repo_input = document.getElementById("repo_form").elements[0].value;
    console.log(repo_input);
    var url = "http://0.0.0.0:5000/users/" + user + "/repos/" + repo_input;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            console.log("Request was successful.");
            var error_message = document.getElementById("repo_error");
            error_message.style.visibility = "hidden";
            repo = repo_input;
			var repo_query_field = document.getElementById("repo_result_form");
            repo_query_field.innerHTML = JSON.stringify(response);
		}
        else if (xhr.readyState == 4 && xhr.status == 404) {
            console.log("Request was not successful.");
            var error_message = document.getElementById("repo_error");
            error_message.style.visibility = "visible";
            error_message.innerHTML = "The repository " + repo_input + " could not be found!";
        }
	}
}


document.getElementById("count_button").onclick = function() {
    if (user == "") {
        var error_message = document.getElementById("count_error");
        error_message.style.visibility = "visible";
        error_message.innerHTML = "Please submit a (valid) username first!";
        return;
    }
    
    var url = "http://0.0.0.0:5000/users/" + user + "/count-repos";
    var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
	xhr.onreadystatechange = processRequest;
	
	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            console.log("Request was successful.");
            var error_message = document.getElementById("count_error");
            error_message.style.visibility = "hidden";
            
            var count = response.number_of_repos;
            var count_box = document.getElementById("count_form").elements[0];
            count_box.value = count;
			
		}
        else if (xhr.readyState == 4 && xhr.status == 404) {
            console.log("Request was not successful.");
            var error_message = document.getElementById("count_error");
            error_message.style.visibility = "visible";
            error_message.innerHTML = "The user " + repo_input + " could not be found!";
        }
	}
}
