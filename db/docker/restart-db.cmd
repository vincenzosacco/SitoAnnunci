@echo off
  @REM LOADS ENVIRONMENT VARIABLES
  set ENV_PATH=..\pg.env
  REM Load pg.env file
    for /f "usebackq tokens=1,2 delims==" %%a in (%ENV_PATH%) do (
        set "%%a=%%b"
        if errorlevel 1 (
            echo Failed to load environment variable %%a from %ENV_PATH%
            exit /b 1
        )
    )

  REM RUN DOCKER COMMANDS
    docker ps -a --format "{{.Names}}" | findstr /i %CONTAINER_NAME% >nul

    @REM IF CONTAINER EXIST
    if %errorlevel%==0 (
        docker restart %CONTAINER_NAME%
    @REM ELSE -> build docker
    ) else (
        launch-docker.cmd
    )



