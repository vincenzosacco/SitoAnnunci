package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unical.backend.model.Utente;
import org.unical.backend.service.IUtenteService;

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
}
