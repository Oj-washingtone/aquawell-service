#!/bin/bash

# Define your image and container names
IMAGE_NAME="aquawell-api-service"
CONTAINER_NAME="aquawell-api-service"
PORT=5000

#start by pulling chages 
echo "Pulling changes from git..."
git pull

# Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .

# Check if the container is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing the existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the Docker container with environment variables
echo "Starting the Docker container..."
docker run --restart=always --network="host" -d -p $PORT:$PORT \
  --name $CONTAINER_NAME \
  -e PORT="$PORT" \
  -e DB_NAME="$DB_NAME" \
  -e DB_USER="$DB_USER" \
  -e DB_PASS="$DB_PASS" \
  -e DB_HOST="$DB_HOST" \
  -e AUTH_SECRET="$AUTH_SECRET" \
  -e MQTT_BROKER="$MQTT_BROKER" \
  -e MQTT_USERNAME="$MQTT_USERNAME" \
  -e MQTT_PASSWORD="$MQTT_PASSWORD" \
  -e SYSTEM_USER_NAME="$SYSTEM_USER_NAME" \
  -e SYSTEM_USER_EMAIL="$SYSTEM_USER_EMAIL" \
  -e SYSTEM_USER_PASSWORD="$SYSTEM_EMAIL" \
  $IMAGE_NAME

echo "Application is running at port $PORT"