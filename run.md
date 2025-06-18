# Run Configuration
## IntelliJIDEA
Nella cartella [.run](./.run) sono presenti le runConfigurations:
- [BackendApplication.run.xml](.run/BackendApplication-dev.run.xml) => backend
.run\BackendApplication-dev.run.xml

- [start_dev.run.xml](.run/start_dev.run.xml) => frontend --development
- [start_prod.run.xml](.run/start_prod.run.xml) => frontend --production

## Shell
Per avviare l'applicazione al di fuori di IntelliJ, assicurarsi
di avere installato [maven](https://maven.apache.org/install.html) e [nodejs](https://nodejs.org/en/download/package-manager/). 


### Application
Per avviare l'applicazione in modalità production dalla `project root` directory

       >#### Production
>Per avviare il server `backend` (production)`project root` directory
>``` shell
># Windows
>./run-be.cmd prod
># Linux/Mac
>./run-be.sh prod
>```
>
>Per avviare il server `frontend` (production) dalla `project root` directory
>``` shell
># Windows
>./run-fe.cmd prod
># Linux/Mac
>./run-fe.sh prod
>```

>#### Development
>Per avviare il server `backend` (development) dalla `project root` directory
>``` shell
># Windows
>./run-be.cmd dev
># Linux/Mac
>./run-be.sh dev
>```
>Per avviare il server `frontend` (development) dalla `project root` directory
>``` bash
># Windows
>./run-fe.cmd dev
># Linux/Mac
>./run-fe.sh dev
>```


