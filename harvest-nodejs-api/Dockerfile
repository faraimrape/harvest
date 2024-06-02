FROM node:14

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

ENV WORDPRESS_BACKEND_API_URL=http://harvest-wordpress-backend:80/wp-json/wp/v2/
ENV PYTHON_MIDDLEWARE_SERVICE_URL=http://harvest-python-middleware:5002/process
ENV AUTHENTICATION_TOKEN ^GoU9V3w*C%yhptS@Apr*3EK

EXPOSE 3000
CMD ["node", "app.js"]
