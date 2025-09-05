package org.example.springboot_back.controller;

import org.example.springboot_back.model.Data;
import org.example.springboot_back.proxy.DataCachingProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.sql.Types;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class DataController {

    private final DataCachingProxy dataProxy;

    public DataController(DataCachingProxy dataProxy) {
        this.dataProxy = dataProxy;
    }

    @GetMapping("/api/data")
    public List<Data> getData() {
        return dataProxy.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Data> getById(@PathVariable int id) {
        return dataProxy.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/update")
    public void updateData(@RequestParam int id, @RequestParam BigDecimal prezzoNuovo) {
        dataProxy.updatePrice(id, prezzoNuovo);
    }

    @PostMapping("/create")
    public ResponseEntity<Data> createAnnuncio(@RequestBody Data nuovoAnnuncio) {
        dataProxy.createAnnuncio(nuovoAnnuncio);
        return ResponseEntity.ok(nuovoAnnuncio);
    }

    @PostMapping("/testpost")
    public ResponseEntity<String> testPost(@RequestBody(required = false) String body) {
        System.out.println("TESTPOST ricevuto: " + body);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/updateSpecData")
    public void updateSpecData(@RequestParam int id,
                               @RequestParam String column,
                               @RequestParam(required = false) String nuovoValore) {
        Object valoreDaSalvare;
        int sqlType;

        try {
            if (nuovoValore == null || nuovoValore.isBlank()) {
                // tratta stringa vuota/null come NULL SQL
                valoreDaSalvare = null;
                sqlType = Types.NULL;
            } else {
                switch (column) {
                    case "latitudine":
                    case "longitudine":
                        valoreDaSalvare = Double.parseDouble(nuovoValore);
                        sqlType = Types.DOUBLE;
                        break;
                    case "prezzonuovo":
                    case "prezzovecchio":
                        valoreDaSalvare = new java.math.BigDecimal(nuovoValore);
                        sqlType = Types.NUMERIC;
                        break;
                    case "superficie":
                        valoreDaSalvare = Integer.parseInt(nuovoValore);
                        sqlType = Types.INTEGER;
                        break;
                    case "foto":
                        // valore è base64 string -> salviamo byte[]
                        valoreDaSalvare = java.util.Base64.getDecoder().decode(nuovoValore);
                        sqlType = Types.BINARY;
                        break;
                    default:
                        valoreDaSalvare = nuovoValore;
                        sqlType = Types.VARCHAR;
                }
            }

            // delega al proxy indicando anche il sqlType
            dataProxy.updateFieldWithType(id, column, valoreDaSalvare, sqlType);

        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato numerico non valido per " + column, ex);
        }
    }

    @DeleteMapping("api/delete/{id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Void> eliminaAnnuncio(@PathVariable int id) {
        dataProxy.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/photos/{annuncioId}")
    public List<byte[]> getPhotos(@PathVariable int annuncioId) {
        return dataProxy.findPhotosByAnnuncioId(annuncioId);
    }

    @GetMapping("/annuncio/{id}/foto/{index}")
    public String getFoto(@PathVariable int id, @PathVariable int index) {
        byte[] dati = dataProxy.getPhotoByAnnuncioIdAndIndex(id, index);
        return dati != null ? Base64.getEncoder().encodeToString(dati) : null;
    }
}