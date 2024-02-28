# Log Ingestor

Please use log json data to start and end with with square bracket. Look in to my logIngestor.json for the correct json syntax i followed. 

Please follow presentation pictures to have more understanding
Note: Date search was not completed

The Log Ingestor is a server application that allows the ingestion of logs over HTTP on port 3000. It includes authentication, log filtering, and serves an HTML-based log query interface. The logs can be ingested using the provided `/logs` endpoint, and the log query interface enables searching, filtering, and pagination of the logs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Logging In](#logging-in)
  - [Fetching Logs](#fetching-logs)
  - [Query Interface](#log-query-interface)
- [Authentication](#authentication)
- [Log Ingestion](#log-ingestion)
- [Customization](#customization)
- [License](#license)


##this is for local run
clone the above repository
Have node installed and all dependices of npm 
else install these
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
 nvm install 20.9.0
 npm install express body-parser
npm install express jsonwebtoken bcrypt
npm install cors

to run use   
``` for running
node server.js
```
This takes logInstallor.js and runs with dummy also it opens 3000 port .

now use html script file to open the web, login with dummy login and password , try the log querr page


This is for direct port run


## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/dyte-submissions/november-2023-hiring-ManojChavva/tree/master
    cd <folder> //here
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. should have node to run locally

## Usage

### Logging In

To use the Log Ingestor, you need to log in first. Use the provided `/login` endpoint with a valid username and password(use any eg: abc and abc). This will return an authentication token that should be included in the headers of subsequent requests.


Use any random username or use the below
```bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "your-username", "password": "your-password"}' http://localhost:3000/login
```

Fetching Logs
After obtaining the authentication token, you can fetch logs using the /logs endpoint. Include the token in the Authorization header of your request.


curl -H "Authorization: Bearer your-auth-token" http://localhost:3000/logs
Log Query Interface
The Log Ingestor also serves a log query interface. Open http://localhost:3000 in your web browser after starting the server. Log in using the provided form and explore the logs using the search and filter options.

Authentication
The Log Ingestor uses JSON Web Tokens (JWT) for authentication. When you log in, a token is generated and should be included in the Authorization header of authenticated requests.

Log Ingestion
Logs can be ingested by making a POST request to the /logs endpoint with log data in the request body.


curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer your-auth-token" -d '{"timestamp": "2023-01-01T12:00:00Z", "message": "Log message"}' http://localhost:3000/logs
Customization
Port: The Log Ingestor runs on port 3000 by default. You can customize the port in the server.js file.

Authentication: Update the authentication logic in the /login endpoint to suit your needs.

Log Ingestion: Adjust the log ingestion logic in the /logs endpoint based on your log data structure.

License
This project is licensed under the MIT License.
