package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.model.Utente;
import org.unical.backend.service.IUtenteService;

import java.util.Collection;

@RestController
@RequestMapping("/utenti")
public class UtentiController {

    private final IUtenteService utenteService;

    public UtentiController(IUtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utente> getUtenteById(@PathVariable("id") int id) {
        Utente utente = utenteService.findById(id);
        if (utente == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(utente);
    }

    @GetMapping("/by-email")
    public ResponseEntity<Utente> getUtenteByEmail(@RequestParam("email") String email) {
        Utente utente = utenteService.findByEmail(email);
        if (utente == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(utente);
    }

    @GetMapping("/venditori")
    public ResponseEntity<Collection<Utente>> getVenditori() {
        return ResponseEntity.ok(utenteService.findByRuolo(2));
    }

    @GetMapping("/acquirenti")
    public ResponseEntity<Collection<Utente>> getAcquirenti() {
        return ResponseEntity.ok(utenteService.findByRuolo(3));
    }
}
