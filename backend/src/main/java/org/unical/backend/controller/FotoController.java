package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.service.IFotoService;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("public/photos")
public class FotoController {
    private final IFotoService fotoService;

    public FotoController(IFotoService fotoService) {
        this.fotoService = fotoService;
    }

    @GetMapping("/annuncio/{idAnnuncio}")
    public ResponseEntity<List<String>> getFotoByAnnuncio(@PathVariable int idAnnuncio) {
        List<String> base64Fotos = fotoService.findByAnnuncioId(idAnnuncio)
            .stream()
            .map(fotoService::convertToBase64)
            .collect(Collectors.toList());
        return ResponseEntity.ok(base64Fotos);
    }
}
