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
        //normalizzo per confronto (tolgo underscore e minuscolo)
        String columnNormalized = columnRaw.replaceAll("_", "").toLowerCase();

        //mappatura verso il nome reale della colonna in DB
        String dbColumn = switch (columnNormalized) {
            case "categoriaid" -> "categoria_id";
            case "venditoreid" -> "venditore_id";
            case "prezzonuovo"-> "prezzo_nuovo";
            case "prezzovecchio" -> "prezzo";
            case "invendita" -> "in_vendita";
            case "datacreazione", "data_creazione" -> "data_creazione";
            default -> columnRaw;
        };

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
                        valoreDaSalvare = Double.parseDouble(raw.replace(',', '.'));
                        sqlType = Types.DOUBLE;
                        break;

                    case "prezzonuovo":
                    case "prezzo_nuovo":
                    case "prezzovecchio":
                    case "prezzo":
                        valoreDaSalvare = new java.math.BigDecimal(raw.replace(',', '.'));
                        sqlType = Types.NUMERIC;
                        break;

                    case "superficie":
                        valoreDaSalvare = Integer.parseInt(raw);
                        sqlType = Types.INTEGER;
                        break;

                    case "categoriaid":
                    case "categoria_id":
                        valoreDaSalvare = Integer.parseInt(raw);
                        sqlType = Types.INTEGER;
                        break;

                    case "venditoreid":
                    case "venditore_id":
                        valoreDaSalvare = Integer.parseInt(raw);
                        sqlType = Types.INTEGER;
                        break;

                    case "invendita":
                    case "in_vendita":
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
                        valoreDaSalvare = java.util.Base64.getDecoder().decode(raw);
                        sqlType = Types.BINARY;
                        break;

                    case "datacreazione":
                    case "data_creazione":
                        valoreDaSalvare = java.time.LocalDateTime.parse(raw);
                        sqlType = Types.TIMESTAMP;
                        break;

                    default:
                        valoreDaSalvare = raw;
                        sqlType = Types.VARCHAR;
                }
            }

            dataProxy.updateFieldWithType(id, dbColumn, valoreDaSalvare, sqlType);

        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato numerico non valido per " + columnRaw, ex);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore: " + ex.getMessage(), ex);
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
        //converto ogni byte in stringa Base64
        return fotos.stream()
                .map(b -> b == null ? null : Base64.getEncoder().encodeToString(b))
                .collect(Collectors.toList());
    }

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

    @PostMapping("/api/astaAdd")
    public ResponseEntity<String> addAsta(@RequestBody Map<String, Object> body) {
        if (body == null || body.get("annuncioId") == null) {
            return ResponseEntity.badRequest().body("annuncioId mancante");
        }
        Integer annuncioId = (body.get("annuncioId") instanceof Number) ? ((Number) body.get("annuncioId")).intValue() : null;
        if (annuncioId == null) return ResponseEntity.badRequest().body("annuncioId non numerico");

        // prezzoBase = prezzo_nuovo dall'annuncio
        BigDecimal prezzoBase = null;
        if (body.get("prezzoBase") != null) {
            Object pb = body.get("prezzoBase");
            if (pb instanceof Number) {
                prezzoBase = new BigDecimal(((Number) pb).toString());
            } else {
                prezzoBase = new BigDecimal(pb.toString().replace(',', '.'));
            }
        } else {
            var optional = dataProxy.getById(annuncioId);
            if (optional.isPresent()) {
                prezzoBase = optional.get().getPrezzoNuovo();
            }
        }

        if (prezzoBase == null) {
            return ResponseEntity.badRequest().body("prezzoBase mancante e prezzo_nuovo non presente per l'annuncio");
        }

        try {
            dataProxy.addAsta(annuncioId, prezzoBase);
            return ResponseEntity.ok("Asta registrata");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore: " + e.getMessage());
        }
    }
}