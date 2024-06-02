# Microservices Integration with Docker

This guide will walk you through setting up a microservices architecture using Docker. The architecture includes a WordPress backend as the data source, a Node.js API to fetch data and serve it to a Python middleware service for data processing. We'll use Docker to orchestrate the containers.

## Prerequisites
Make sure you have the following dependencies installed on your system:
- Docker ([Docker's official website](https://www.docker.com/products/docker-desktop))
- Node.js v18 
- Python v3+

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

## Unit Tests
- You can run unit tests for the Harvest Node.js API by navigating to the `harvest-nodejs-api` directory and running: `npm test`.
- Similarly, tests for the Harvest Python Middleware can be run by navigating to the `harvest-python-middleware` directory and running: `pytest`.

## Cleanup
- To stop and remove the Docker containers, run: `docker-compose down`.

## License
This project is licensed under the [MIT License](LICENSE).
