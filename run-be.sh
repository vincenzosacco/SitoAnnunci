#!/bin/bash

# Run backend in dev mode or prod mode
# Must be run from project root because backend/pom.xml must read 'app.properties' from root
set -e

# Check if the required files exist
if [ ! -f "backend/pom.xml" ]; then
    echo "Missing backend/pom.xml"
    exit 1
fi
if [ ! -f "app.properties" ]; then
    echo "Missing .app-properties file"
    exit 1
fi

# Argument parsing
if [ "$1" = "dev" ]; then
    echo "Running backend in development mode..."
    mvn  "-Dspring-boot.run.profiles=dev" -pl backend spring-boot:run
elif [ "$1" = "prod" ]; then
    echo "Running backend in production mode..."
    mvn "-Dspring-boot.run.profiles=prod" -pl backend spring-boot:run
else
    echo "Unknown environment: $1 please use 'dev' or 'prod'."
    exit 1
fi
