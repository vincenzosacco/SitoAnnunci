package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.model.Recensione;
import org.unical.backend.service.IRecensioneService;

import java.util.List;

@RestController
@RequestMapping("/recensioni")
public class RecensioniController {

    private final IRecensioneService recensioneService;

    public RecensioniController(IRecensioneService recensioneService) {
        this.recensioneService = recensioneService;
    }

    @PostMapping
    public ResponseEntity<Recensione> creaRecensione(@RequestBody Recensione recensione) {
        return ResponseEntity.ok(recensioneService.save(recensione));
    }

    @GetMapping
    public ResponseEntity<List<Recensione>> getAll() {
        return ResponseEntity.ok(recensioneService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recensione> getById(@PathVariable int id) {
        return ResponseEntity.ok(recensioneService.findById(id));
    }

    @GetMapping("/annuncio/{annuncioId}")
    public ResponseEntity<List<Recensione>> getByAnnuncio(@PathVariable int annuncioId) {
        return ResponseEntity.ok(recensioneService.findByAnnuncioId(annuncioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        recensioneService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
