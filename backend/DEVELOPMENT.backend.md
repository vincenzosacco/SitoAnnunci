# DEVELOPER GUIDE - BACKEND
Questo file contiene tutte informazioni utili per chi sviluppa il progetto.

# Structure Summary

- `src/main/java/org/unical/`: 
  >- `backend/`: contiene il codice principale del backend
  >- `config/`: contiene le configurazioni Spring Boot (CORS, ecc.)
  >- `controller/`: contiene i REST controller dell'applicazione, quindi come vengono gestiti gli endpoint dell' API.
  >- `exceptions/`: contiene le classi exception custom create per il backend.
  >- `model/`: contiene le classi che rappresentano i modelli del database, ovvero le tabelle del database rappresentate come classi Java.
  >- `persistence/`: contiene tutto ciò che riguarda l'interfaccia per interagire con il database. Utilizza pattern DAO (Data Access Object).
  >  - `service/`: contiene le classi che stanno 'in mezzo' tra il `controller` e l'implementazione di `persistence`. Di fatto `controller` si interfaccia solo con `persistance/service`.
  
  >- `utils/`: contiene le classi di utilità create per il backend.

