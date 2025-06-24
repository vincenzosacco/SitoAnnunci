#!/bin/bash
# LOADS ENVIRONMENT VARIABLES
ENV_PATH="../pg.env"
if [ -f "$ENV_PATH" ]; then
    set -a
    source "$ENV_PATH"
    set +a
else
    echo "Environment file $ENV_PATH not found."
    exit 1
fi

# RUN DOCKER COMMANDS
if docker ps -a --format "{{.Names}}" | grep -i -q "$CONTAINER_NAME"; then
    docker restart "$CONTAINER_NAME"
else
    launch-docker.sh
fi
