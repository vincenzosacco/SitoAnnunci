package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAnnuncioService;

@RestController
@RequestMapping("public/annunci")
public class AnnunciController {
    private final IAnnuncioService annService;

    public AnnunciController(IAnnuncioService annService) {
        this.annService = annService;
    }

    @GetMapping(value = {"/",""})
    public ResponseEntity<Iterable<Annuncio>> getAllAnnunci() {
        return ResponseEntity.ok(this.annService.findAll());
    }

    @GetMapping(value = "/{idAnnuncio}")
    ResponseEntity<Annuncio> getAnnuncioById(@PathVariable("idAnnuncio") int id) {
        return ResponseEntity.ok(this.annService.findById(id));
    }

}
