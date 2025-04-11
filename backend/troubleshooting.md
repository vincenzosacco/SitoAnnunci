# Common issues and errors
## IntelliJIDEA
Se il modulo `backend` riporta errori con `lombok`:
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.36</version>
    <scope>compile</scope>
</dependency>
```

Provare i seguenti comandi :
```shell
  mvn idea:clean
```
```shell
  mvn idea:idea
```






