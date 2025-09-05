# Progetto WebApplication - Appello 03/04/25
[//]: # (Descrizione del progetto)
>Progetto per il corso di *WebApplication-Cds Informatica-Unical- 2024/2025*
>#### Studenti 
>- Vincenzo Sacco - 234681
>- Andrea Mirarchi - 246005
>- Francesco Iorio - 220486
>- Francesco Ferraro - 223567

## Descrizione
Il progetto è un'applicazione web che ...

## Configurazione
Per prima cosa dopo avere clonato il repository, eseguire dall root del progetto:
```bash
mvn clean install
```
Questo comando installa le dipendenze e compila il progetto.


L'applicazione ha due configurazioni 
- **dev (Development)**: 
  - Il _frontend_ non cambia.
  - Il backend interroga un database in memoria (H2) per lo sviluppo rapido.
  - Configurazioni di debug attivate.
  - Adatta per lo sviluppo e il testing locale.
- **prod (Production)** 
  - Il _frontend_ non cambia.
  - Il backend interroga un database PostgreSQL per la produzione.
  - Configurazioni di sicurezza e performance ottimizzate.
- Adatta per l'ambiente di produzione.
 
>[Run](./run.md) in modalità *development* o *production*.


## Frameworks and Technologies

### Maven
Il progetto è gestito con [Maven](https://maven.apache.org), ed è diviso in due sottomoduli:

*[pom.xml (root)](./pom.xml)*
``` xml 
<modules>
   <module>frontend</module>
   <module>backend</module>
</modules>
```

### Angular
Il frontend è sviluppato con [Angular](https://angular.io/), un framework per applicazioni web single-page (SPA).
- AngularCLI version: 19.2.15
- Node.js version: v22.11.0
- npm version: 11.2.0

Maggiori dettagli nel *[(frontend)](./frontend)* *[pom.xml ](./frontend/pom.xml)*

### Spring Boot
Il backend è sviluppato con [Spring Boot](https://spring.io/projects/spring-boot), un framework per applicazioni Java che semplifica la configurazione e l'avvio di applicazioni web.
- Spring Boot version: 3.4.4

Maggiori dettagli nel *[(backend)](./backend)* *[pom.xml](./backend/pom.xml)*

### PostgresSQL
...

### H2 Database
...


---
## Troubleshooting
- [Problemi comuni con il backend](./backend/troubleshooting.md)
- [Problemi comuni con il frontend](./frontend/troubleshooting.md)
