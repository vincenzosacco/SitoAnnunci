#!/bin/bash
set -e

# Check if the required files exist
if [ ! -f "frontend/pom.xml" ]; then
    echo "Error: frontend/pom.xml not found. Please run this script from the project root directory."
    exit 1
fi
if [ ! -f ".app-properties" ]; then
    echo "Error: .app-properties file not found. Please run this script from the project root directory."
    exit 1
fi

# Argument parsing
if [ "$1" == "dev" ]; then
    echo "Running frontend in development mode..."
    cd frontend && npm run start:dev
elif [ "$1" == "prod" ]; then
    echo "Running frontend in production mode..."
    cd frontend && npm run start:prod
else
    echo "Unknown environment: $1"
    echo "Usage: ./run-fe.sh [dev|prod]"
    exit 1
fi