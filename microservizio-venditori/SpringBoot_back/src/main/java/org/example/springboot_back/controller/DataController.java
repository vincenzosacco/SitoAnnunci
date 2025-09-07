package org.example.springboot_back.controller;

import org.example.springboot_back.model.Data;
import org.example.springboot_back.proxy.DataCachingProxy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.sql.Types;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
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
    public void updateSpecData(@RequestBody Map<String, Object> body) {
        // aspettati JSON: { "id": 123, "column": "prezzo_nuovo", "nuovoValore": "12345.67" }
        if (body == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body mancante");
        }

        Integer idObj = (body.get("id") instanceof Number) ? ((Number) body.get("id")).intValue() : null;
        String columnRaw = body.get("column") != null ? body.get("column").toString() : null;
        Object nuovoValoreRaw = body.get("nuovoValore");

        if (idObj == null || columnRaw == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parametri 'id' o 'column' mancanti");
        }

        int id = idObj;
        // normalizza: togli underscore e minuscola per confronto
        String columnNormalized = columnRaw.replaceAll("_", "").toLowerCase();

        Object valoreDaSalvare = null;
        int sqlType = Types.VARCHAR;

        try {
            if (nuovoValoreRaw == null || nuovoValoreRaw.toString().isBlank()) {
                valoreDaSalvare = null;
                sqlType = Types.NULL;
            } else {
                String raw = nuovoValoreRaw.toString().trim();

                switch (columnNormalized) {
                    case "latitudine":
                    case "longitudine":
                        // double
                        valoreDaSalvare = Double.parseDouble(raw.replace(',', '.'));
                        sqlType = Types.DOUBLE;
                        break;

                    case "prezzonuovo":
                    case "prezzo_nuovo":
                    case "prezzovecchio":
                    case "prezzo": // se usi anche questo
                        // BigDecimal: assicurati che venga passato con '.' come separatore decimale
                        valoreDaSalvare = new java.math.BigDecimal(raw.replace(',', '.'));
                        sqlType = Types.NUMERIC;
                        break;

                    case "superficie":
                        valoreDaSalvare = Integer.parseInt(raw);
                        sqlType = Types.INTEGER;
                        break;

                    case "invendita":
                    case "in_vendita":
                        // accettiamo stringhe "true"/"false" o numeri 0/1
                        if ("true".equalsIgnoreCase(raw) || "1".equals(raw)) {
                            valoreDaSalvare = true;
                        } else if ("false".equalsIgnoreCase(raw) || "0".equals(raw)) {
                            valoreDaSalvare = false;
                        } else {
                            throw new NumberFormatException("Booleano non riconosciuto: " + raw);
                        }
                        sqlType = Types.BOOLEAN;
                        break;

                    case "foto":
                        // base64 -> byte[]
                        valoreDaSalvare = java.util.Base64.getDecoder().decode(raw);
                        sqlType = Types.BINARY;
                        break;

                    default:
                        // stringhe generiche (titolo, descrizione, indirizzo, ecc.)
                        valoreDaSalvare = raw;
                        sqlType = Types.VARCHAR;
                }
            }

            // delega al proxy che userà il DAO
            dataProxy.updateFieldWithType(id, columnRaw, valoreDaSalvare, sqlType);

        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato numerico non valido per " + columnRaw, ex);
        }
    }

    @DeleteMapping("/api/delete/{id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Void> eliminaAnnuncio(@PathVariable int id) {
        dataProxy.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/annunci/{annuncioId}/foto")
    public List<String> getFotosForAnnuncio(@PathVariable int annuncioId) {
        List<byte[]> fotos = dataProxy.findPhotosByAnnuncioId(annuncioId);
        // Convertiamo ogni byte[] in stringa Base64 (Angular si aspetta stringhe)
        return fotos.stream()
                .map(b -> b == null ? null : Base64.getEncoder().encodeToString(b))
                .collect(Collectors.toList());
    }

    /**
     * Aggiunge una foto in Base64 a un annuncio.
     * POST /api/annunci/{annuncioId}/foto
     * Body JSON: { "fotoBase64": "..." }
     */
    @PostMapping("/api/annunci/{annuncioId}/fotoAdd")
    public ResponseEntity<String> addPhoto(
            @PathVariable int annuncioId,
            @RequestBody Map<String, String> body) {

        String fotoBase64 = body.get("fotoBase64");
        if (fotoBase64 == null || fotoBase64.isBlank()) {
            return ResponseEntity.badRequest().body("Campo 'fotoBase64' mancante o vuoto");
        }

        try {
            byte[] fotoBytes = Base64.getDecoder().decode(fotoBase64);
            dataProxy.addPhoto(annuncioId, fotoBytes);
            return ResponseEntity.ok("Foto aggiunta con successo");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Base64 non valido");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore server: " + e.getMessage());
        }
    }
    @DeleteMapping("/api/annunci/{annuncioId}/foto/{index}")
    public ResponseEntity<String> removePhotoByIndex(
            @PathVariable int annuncioId,
            @PathVariable int index) {
        boolean removed = dataProxy.removePhotoByIndex(annuncioId, index);
        if (removed) {
            return ResponseEntity.ok("Foto rimossa correttamente (index=" + index + ")");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Foto non trovata all'indice " + index);
        }
    }
}