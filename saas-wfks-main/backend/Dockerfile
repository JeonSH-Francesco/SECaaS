# Use the official Python image as a base image
FROM python:3.8-slim

RUN mkdir /app

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .


RUN pip install update 
# Install dependencies
RUN pip install -r requirements.txt

# Copy the requirements file into the container
COPY requirements2.txt .

RUN apt update

RUN apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config -y
RUN pip install gunicorn
# Install dependencies
RUN pip install -r requirements2.txt


# Copy the rest of the application code into the container
COPY . .

# Expose the port that uWSGI will run on
EXPOSE 5000

# Command to run the application using uWSGI
CMD ["gunicorn", "--bind", "0.0.0.0:5000","--timeout=300", "app:app"]