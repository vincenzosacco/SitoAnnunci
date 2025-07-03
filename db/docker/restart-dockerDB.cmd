@echo off
REM LOADS ENVIRONMENT VARIABLES
setlocal EnableDelayedExpansion




if "%~1"=="" (goto show_usage)
set ENV_PATH=%~1

REM check if docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker and try again.
    exit /b 1
)


REM Load pg.env file
for /f "usebackq tokens=1,2 delims==" %%a in (%ENV_PATH%) do (
    set "%%a=%%b"
    if errorlevel 1 (
        echo Failed to load environment variable %%a from %ENV_PATH%
        exit /b 1
    )
)

REM RUN DOCKER
docker ps -a --format "{{.Names}}" | findstr /i %CONTAINER_NAME% > nul

REM IF CONTAINER EXIST
if %errorlevel% == 0 (
    docker restart %CONTAINER_NAME%
) else (
    set /p confirm="Container '!CONTAINER_NAME!' does not exist. Do you want to create it? (y/n): "
    if /i "!confirm!"=="y" (
        set /p DUMP_PATH="Enter the path to the dump file: "
        if not exist "!DUMP_PATH!" (
            echo Dump file %DUMP_PATH% does not exist.
            exit /b 1
        )
        set /p DOCKERFILE_PARENT_PATH="Enter the path to the Dockerfile parent directory: "
        if not exist "!DOCKERFILE_PARENT_PATH!" (
            echo Dockerfile parent directory %DOCKERFILE_PARENT_PATH% does not exist.
            exit /b 1
        )

        call launch-docker.cmd !ENV_PATH! !DUMP_PATH! !DOCKERFILE_PARENT_PATH!
    ) else (
        echo Exiting without creating the container.
        exit /b 0
    )
)
exit /b 0


goto :eof
:show_usage
echo Usage: restart-dockerDB ^<ENV_PATH^>
echo ^<ENV_PATH^> - Path to the environment file (.env) containing Database configuration.
exit /b 1
