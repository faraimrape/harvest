FROM python:3.8

WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
ENV AUTHENTICATION_TOKEN ^GoU9V3w*C%yhptS@Apr*3EK
EXPOSE 5002
CMD ["python", "app.py"]
