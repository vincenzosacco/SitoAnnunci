package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAnnuncioService;

@RestController
@RequestMapping("annunci")
public class AnnunciController {
    private final IAnnuncioService annService;

    public AnnunciController(IAnnuncioService annService) {
        this.annService = annService;
    }

    @GetMapping(value = {"/",""})
    ResponseEntity<Iterable<Annuncio>> getAllAnnunci() {
        return ResponseEntity.ok(this.annService.findAll());
    }

    @GetMapping(value = "/{idAnnuncio}")
    ResponseEntity<Annuncio> getAnnuncioById(@PathVariable("idAnnuncio") int id) {
        return ResponseEntity.ok(this.annService.findById(id));
    }

}
