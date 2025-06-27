package org.unical.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.unical.backend.model.Messaggio;
import org.unical.backend.model.Utente;
import org.unical.backend.service.IMessaggioService;

import java.util.List;


@RestController
@RequestMapping("/messaggi")
public class MessaggiController {

    private final IMessaggioService messaggioService;

    public MessaggiController(IMessaggioService messaggioService) {
        this.messaggioService = messaggioService;
    }

    @GetMapping("/conversazione")
    public ResponseEntity<List<Messaggio>> getMessaggiByUtenti(
        @RequestParam int utente1,
        @RequestParam int utente2) {

        int conversazioneId = messaggioService.getOrCreateConversazioneId(utente1, utente2);
        List<Messaggio> messaggi = messaggioService.getMessaggiByConversazione(conversazioneId);
        return ResponseEntity.ok(messaggi);
    }

    @GetMapping("/conversazioni/{utenteId}")
    public ResponseEntity<List<Utente>> getConversazioni(@PathVariable int utenteId) {
        return ResponseEntity.ok(messaggioService.getConversazioniUtente(utenteId));
    }

    @PostMapping
    public ResponseEntity<Messaggio> inviaMessaggio(@RequestBody Messaggio m) {
        return ResponseEntity.ok(messaggioService.inviaMessaggio(m));
    }

}
