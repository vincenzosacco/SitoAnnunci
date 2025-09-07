package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.model.Asta;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAstaService;
import org.unical.backend.service.IAnnuncioService;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/annunci/{annuncioId}/asta")
public class AstaController {

    private final IAstaService astaService;
    private final IAnnuncioService annuncioService;

    public AstaController(IAstaService astaService, IAnnuncioService annuncioService) {
        this.astaService = astaService;
        this.annuncioService = annuncioService;
    }


    @GetMapping
    public ResponseEntity<Asta> getAstaByAnnuncio(@PathVariable int annuncioId) {
        Annuncio annuncio = annuncioService.findById(annuncioId);

        // se l'annuncio non ha un'asta attiva non mando nulla
        if (annuncio == null) {
            return ResponseEntity.notFound().build();
        }

        Asta asta = astaService.findAll().stream().filter(a -> a.getAnnuncio_id() == annuncioId && "ATTIVA".equalsIgnoreCase(a.getStato())).findFirst().orElse(null);

        if (asta == null) {
            return ResponseEntity.noContent().build(); // 204 => nessuna asta attiva
        }

        return ResponseEntity.ok(asta);
    }

    /**
     * Crea un'asta su un annuncio (solo venditore).
     */
    @PostMapping
    public ResponseEntity<Asta> createAsta(@PathVariable int annuncioId, @RequestBody Asta asta) throws Exception {
        asta.setAnnuncio_id(annuncioId);
        return ResponseEntity.ok(astaService.createAsta(asta));
    }

    /**
     * Invia un'offerta per l'annuncio/asta attiva.
     */
    @PostMapping("/offerta")
    public ResponseEntity<Asta> makeOffer(@PathVariable int annuncioId, @RequestBody Map<String, Object> payload) throws Exception {

        int idOfferente = (int) payload.get("idOfferente");
        BigDecimal importo = new BigDecimal(payload.get("importo").toString());

        Asta asta = astaService.findAll().stream().filter(a -> a.getAnnuncio_id() == annuncioId && "ATTIVA".equalsIgnoreCase(a.getStato())).findFirst().orElse(null);

        if (asta == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(astaService.makeOffer(asta.getId(), idOfferente, importo));
    }
}
