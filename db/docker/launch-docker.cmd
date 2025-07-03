@echo off
setlocal EnableDelayedExpansion

if "%~1"=="" (goto show_usage)
set ENV_PATH=%~1

if "%~2"=="" (goto show_usage)
set DUMP_PATH=%~2

if "%~3"=="" (goto show_usage)
set DOCKERFILE_PARENT_PATH=%~3

REM Load pg.env file
for /f "usebackq tokens=1,* delims==" %%a in (%ENV_PATH%) do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" (
        set "%%a=%%b"
        echo Set %%a=%%b
    ) else (
        echo Skipping comment: %%a
    )
)

REM REMOVE previous files related to the Container
docker rm -f %CONTAINER_NAME% 2>NUL
if errorlevel 1 (
    echo Container %CONTAINER_NAME% does not exist or could not be removed. Continuing...
)

docker rmi -f %IMAGE_NAME% 2>NUL
if errorlevel 1 (
    echo Image %IMAGE_NAME% does not exist or could not be removed. Continuing...
)

docker volume ls --format "{{.Name}}" | findstr /i %VOLUME_NAME% >nul
if %errorlevel%==0 (
    set /p confirm="Volume %VOLUME_NAME% exists. Docker does not overwrite volumes by default. Do you want to remove it? (y/n): "
    if /i "!confirm!"=="y" (
        docker volume rm %VOLUME_NAME% 2>NUL
        if errorlevel 1 (
            echo Failed to remove Docker volume %VOLUME_NAME%. Continuing...
        )
    )
) else (
    echo No existing volume found. Creating a new one named: %VOLUME_NAME%
)

REM COPY dump file to current directory
if not exist "%DUMP_PATH%" (
    echo Dump file %DUMP_PATH% does not exist.
    exit /b 1
)
set CP_DUMP_PATH=%DOCKERFILE_PARENT_PATH%\dump-sito_annunci.sql
@REM Copy dump file to Dockerfile parent directory and overwrite if it exists
COPY /Y "%DUMP_PATH%" %CP_DUMP_PATH% > NUL

REM Build Docker image from Dockerfile
docker build -t %IMAGE_NAME% %DOCKERFILE_PARENT_PATH%

REM Run new container
docker run --name %CONTAINER_NAME% -d -p 5432:5432 ^
--env-file %ENV_PATH% ^
-v %VOLUME_NAME%:/var/lib/postgresql/data ^
%IMAGE_NAME%

REM REMOVE dump file (not needed anymore)
del "%CP_DUMP_PATH%" > NUL
if errorlevel 1 (
    echo Failed to delete dump file %CP_DUMP_PATH%. Continuing...
)

goto :eof

:show_usage
echo Usage: %~nx0 ENV_PATH DUMP_PATH DOCKERFILE_PARENT_PATH
exit /b 1
