# Run Configuration
## IntelliJIDEA
Nella cartella [.run](./.run) sono presenti le runConfigurations:
- [BackendApplication.run.xml](.run/BackendApplication.run.xml) => backend


- [start_dev.run.xml](.run/start_dev.run.xml) => frontend --development
- [start_prod.run.xml](.run/start_prod.run.xml) => frontend --production

## Shell
Per avviare l'applicazione al di fuori di IntelliJ, è necessario eseguire i seguenti comandi:

### Application
Per avviare l'applicazione in modalità production dalla `project root` directory
- production : run section [production](#production)
- development : run section [development](#development)


>#### Production
>Per avviare il server `backend` (production)`project root` directory
>``` shell
>mvn -pl backend spring-boot:run
>```
>*NOTE: il server backend reale è interrogato solo in modalità production. 
>In modalità development il server backend è simulato da un server mock (json-server) nella cartella frontend.*
>
>Per avviare il server `frontend` (production) dalla `project root` directory
>``` shell
>cd frontend ; npm run start:prod
>```

>#### Development
>Per avviare il server `backend` (development) dalla `project root` directory
>``` shell
>cd frontend ; npm run mock:be
>```
>*NOTE:In modalità development il server backend è simulato da un server mock (json-server) nella cartella frontend.*
>Per avviare il server `frontend` (development) `project root` directory
>``` bash
>cd frontend ; npm run start:dev
>```


