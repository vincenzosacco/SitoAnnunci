@echo off
@REM Run backend in dev mode or prod mode
@REM Must be run from project root because backend/pom.xml must read '.properties' from root


@REM Check if the required files exist
if not exist "backend\pom.xml" (
    echo Error: backend/pom.xml not found. Please run this script from the project root directory.
    exit /b 1
)
if not exist ".app-properties" (
    echo Error: .app-properties file not found. Please run this script from the project root directory.
    exit /b 1
)


@REM Argument parsing
if "%1"=="dev" (
    echo Running backend in development mode...
    mvn "-Dspring-boot.run.profiles=dev" -pl backend spring-boot:run
) else if "%1"=="prod" (
    echo Running backend in production mode...
    mvn "-Dspring-boot.run.profiles=prod" -pl backend spring-boot:run
) else (
    echo Unknown environment: %1 - please specify 'dev' or 'prod'.
    exit /b 1
)