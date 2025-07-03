#!/bin/bash
set -e

## VARIABLES
    ENV_PATH=../pg.env
    DUMP_PATH=../dump-sito_annuncisql

## Load pg.env file
    set -a
    source $ENV_PATH || { echo "Failed to source pg.env"; exit 1; }
    set +a

## REMOVE previous files related to the container
    # Remove existing container if exists ( cannot remove image if container is running )
    docker rm -f "$CONTAINER_NAME" 2>/dev/null || echo "No previous container to remove"
    # Remove existing image if exists
    docker rmi -f "$IMAGE_NAME" 2>/dev/null || echo "No previous image to remove"
    # Check if volume exists and ask for confirmation to remove it
    docker volume ls --format "{{.Name}}" | findstr /i %VOLUME_NAME% >nul
    if [ $? -eq 0 ]; then
        read -p "Volume $VOLUME_NAME already exists. Do you want to remove it? (y/n): " confirm
        if [[ "$confirm" == [yY] ]]; then
            docker volume rm "$VOLUME_NAME" || { echo "Failed to remove volume"; exit 1; }
        else
            echo "Keeping existing volume $VOLUME_NAME"
        fi
    else
        echo "No existing volume $VOLUME_NAME found. Creating a new one name $VOLUME_NAME"
    fi



## COPY dump from $DUMP_PATH to current directory
if [ ! -f "$DUMP_PATH" ]; then
  echo "Dump file not found: $DUMP_PATH"
  exit 1
fi
NEW_DUMP_FILENAME=dump-sito_annunci.sql
# Copy dump file to current directory
cp "$DUMP_PATH" ./$NEW_DUMP_FILENAME || { echo "Failed to copy dump file"; exit 1; }

# Build Docker image from Dockerfile
docker build -t "$IMAGE_NAME" . || { echo "Docker build failed"; exit 1; }

# Run new container
docker run --name "$CONTAINER_NAME" -d  \
  --env-file "$ENV_PATH" \
  -p "5432:5432" -v "$VOLUME_NAME:/var/lib/postgresql/data" \
  "$IMAGE_NAME" || { echo "Docker run failed"; exit 1; }

## REMOVE dump file from current directory ( not needed anymore )
rm -f "$NEW_DUMP_FILENAME" || { echo "Failed to remove dump file"; exit 1; }
