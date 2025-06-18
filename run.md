# Run Configuration
Prima di eseguire l'applicazione, assicurati di avere installato le dipendenze necessarie. 
Puoi farlo eseguendo il comando `mvn install`(_[troubleshooting](backend/troubleshooting.md#compilation-errors)_) nella directory principale del progetto.


## IntelliJIDEA
Nella cartella [.run](./.run) sono presenti le runConfigurations:
- [BackendApplication-dev](.run/BackendApplication-dev.run.xml) - backend in modalità dev
- [start:dev](.run/start_dev.run.xml) - frontend in modalità dev
- [BackendApplication-prod](.run/BackendApplication-prod.run.xml) - backend in modalità prod
- [start:prod](.run/start_prod.run.xml) - frontend in modalità prod

## Shell
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


