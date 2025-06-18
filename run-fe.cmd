@echo off
@REM Run the frontend server in dev mode or prod mode

@REM Check if the required files exist
if not exist "frontend\pom.xml" (
    echo Error: frontend/pom.xml not found. Please run this script from the project root directory.
    exit /b 1
)
if not exist "app.properties" (
    echo Error: app.properties file not found. Please run this script from the project root directory.
    exit /b 1
)

@REM Argument parsing
if "%1"=="dev" (
    echo Running frontend in development mode...
    cd frontend && npm run start:dev
) else if "%1"=="prod" (
    echo Running frontend in production mode...
    cd frontend && npm run start:prod
) else (
    echo Unknown environment: %1
    echo Usage: run-fe.cmd [dev^|prod]
    exit /b 1
)
