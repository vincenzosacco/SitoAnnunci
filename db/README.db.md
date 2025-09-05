# DATABASE - PostgreSQL17
Il backend di questo progetto utilizza PostgreSQL 17 come database relazionale. Di seguito sono riportate le istruzioni per l'installazione e la configurazione.

## Configurazione del database
Di base il [pom.xml](./pom.xml) di questo progetto è configurato per utilizzare docker come host per il db.
Le variabili d'ambiente necessarie sono gestite nel file [pg.env](./pg.env).

### Docker
Se si vuole utilizzare Docker come host per il database, assicurarsi di avere installato [Docker](https://www.docker.com/get-started) e che sia in esecuzione.
Dopo è sufficiente buildare l'immagine seguendo uno dei metodi seguenti:

- #### Maven (consigliato)
    Dalla cartella [db](.) eseguire il comando:
    ```bash
    mvn clean install -DskipTests
    ```
    Questo comando viene chiamato automaticamente da Maven quando si esegue il comando `mvn clean install` nella cartella principale del progetto.
     
- #### Shell 
  Dalla cartella [db](.) eseguire il comando:
  ```bash
  # Windows
  .\docker\launch-docker.cmd pg.env dump-sito_annunci.sql docker\Dockerfile

  # Linux/Mac
  .\docker\launch-docker.sh pg.env dump-sito_annunci.sql docker\Dockerfile
  ```


### Host NON-docker
Se si desidera hostare direttamente sulla macchina o da qualsiasi altra parte che non sia Docker: 
1. Installare [PostgreSQL 17](https://www.postgresql.org/download/)
(è molto importante che sia la versione 17, altrimenti [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) non funzionerà correttamente).

2. Creare il database, ad esempio con il comando:
    ```sql
    -- Sostituisci con i valori presenti nel file .env
    CREATE DATABASE $POSTGRES_DB;  
    -- Crea l'utente con la password
    CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
    ```

3. Connettersi al db , ad esempio col comando:
    ```bash
    # Sostituisci con i valori presenti nel file .env
    psql -U $POSTGRES_USER -d $POSTGRES_DB 
    ```

4. Eseguire il restore del [dump del database](./dump-sito_annunci-202506151937.sql):
    ```bash
    # Sostituisci con i valori presenti nel file .env
    # path/to/dump-db.sql dipende da dove viene runnato il comando
    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" path/to/dump-db.sql
    ```
