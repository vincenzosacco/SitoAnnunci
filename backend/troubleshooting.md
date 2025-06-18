# Common issues and errors

## Compilation errors
### IntelliJIDEA
Se nella fase di compilazione del progetto si verificano errori del tipo:
```text
ERROR: Cannot resolve symbol 'Getter' 
ERROR: Cannot resolve symbol 'Setter'
```  
dove 'Getter' e 'Setter' sono ad esempio 'getId', 'setId', 'getName', 'setName' ecc.

Assicurarsi che :
- non sia un errore del programmatore 
- `lombok` sia installato correttamente

Se l'errore persiste potrebbe essere un problema di IntelliJIDEA con la dipendenza:
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.36</version>
    <scope>compile</scope>
</dependency>
```
in quanto `lombok` fornisce annotazioni come `@Getter` e `@Setter` per generare automaticamente i metodi getter e setter e altro boilerplate code.

**Provare i seguenti comandi :**
```shell
  mvn idea:clean
```
```shell
  mvn idea:idea
```






