# Microservices Integration with Docker

This guide will walk you through setting up a microservices architecture using Docker. The architecture includes a WordPress backend as the data source, a Node.js API to fetch data and serve it to a Python middleware service for data processing. We'll use Docker to orchestrate the containers.

## Prerequisites
Make sure you have the following dependencies installed on your system:
- Docker ([Docker's official website](https://www.docker.com/products/docker-desktop))
- Node.js v14+ 
- Python v3+
- Clone this repository: `git@github.com:faraimrape/harvest.git`

## Setup Instructions
1. **Harvest WordPress Backend Service**
   - Navigate into the `harvest` cloned folder.
   - Verify that the `harvest-wordpress-backend` directory has been created inside the `harvest` folder.
   - Ensure that there is a Dockerfile inside.

2. **Harvest Node.js API Service**
   - Navigate into the cloned `harvest` folder and verify that the `harvest-nodejs-api` directory exists.
   - Open the Dockerfile and ensure that the following variables exist as is:
     - `WORDPRESS_BACKEND_API_URL=http://harvest-wordpress-backend:80/wp-json/wp/v2/`
     - `PYTHON_MIDDLEWARE_SERVICE_URL=http://harvest-python-middleware:5002/process`
     - `AUTHENTICATION_TOKEN`
   - Add your token key `^GoU9V3w*C%yhptS@Apr*3EK` to the `AUTHENTICATION_TOKEN` variable to secure your API Calls.
   - Run `npm install`.
   - Navigate back to the `harvest` root directory: `cd ..`.

3. **Harvest Python Middleware Service**
   - Navigate to the `harvest-python-middleware` directory.
   - Open the Dockerfile and ensure that the following variable exists: `AUTHENTICATION_TOKEN`.
   - Add your token key `^GoU9V3w*C%yhptS@Apr*3EK` to the `AUTHENTICATION_TOKEN` variable to secure your API Calls.
   - Execute project dependencies: `pip install -r requirements.txt`.
   - Navigate back to the `harvest` root directory: `cd ..`.

## Accessing the Services
Inside the `harvest` root folder, execute `docker-compose up --build` and verify that each of the services is up and running. First and foremost, go to http://localhost:8000 and finish setting up the WordPress instance; you will need to create an administration user account and a sample site name. 

- Harvest WordPress Backend: http://localhost:8000
- Harvest Node.js API: http://localhost:3000
- Harvest Python Middleware: http://localhost:5002

# API Endpoints

Below is the set of endpoints to interact with the microservices. Please note that all requests require a Bearer token for authentication. Kindly refer to the json collection for further tests through postman

## Base URL

The base URL for all API requests is:
`http://localhost:3000/api/`

## Authorization

All endpoints require a Bearer token for authorization. Include the following header in each request:
Authorization: Bearer `^GoU9V3w*C%yhptS@Apr*3EK` 

## Endpoints

### Posts
- **Retrieve all posts**
GET /api/posts

- **Retrieve a single post by ID**
GET /api/posts/{post_id}

### Pages
- **Retrieve all pages**
GET /api/pages

- **Retrieve a single page by ID**
GET /api/pages/{page_id}

### Comments
- **Retrieve all comments**
GET /api/comments

- **Retrieve comments for a specific post**
GET /api/comments?post={post_id}

### Users
- **Retrieve all users**
GET /api/users

- **Retrieve a single user by ID**
GET /api/users/{user_id}

### Taxonomies
- **Retrieve all categories**
GET /api/categories

### Media
- **Retrieve all media items**
GET /api/media

### Tags
- **Retrieve all tags**
GET /api/tags

## Unit Tests
- You can run unit tests for the Harvest Node.js API by navigating to the `harvest-nodejs-api` directory and running: `npm test`.
- Similarly, tests for the Harvest Python Middleware can be run by navigating to the `harvest-python-middleware` directory and running: `pytest app_tests.py`.

## Cleanup
- To stop and remove the Docker containers, run: `docker-compose down`.
