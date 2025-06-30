package org.unical.backend.service;

import org.unical.backend.model.Messaggio;
import org.unical.backend.model.Utente;

import java.util.List;

public interface IMessaggioService {

    List<Messaggio> getMessaggiByConversazione(int conversazioneId);

    Messaggio inviaMessaggio(Messaggio messaggio);

    List<Utente> getConversazioniUtente(int utenteId);

    int getConversazioneId(int utente1Id, int utente2Id);

    List<Messaggio> findAll();
    Messaggio findById(int id);
    void deleteMessaggio(int id);


}
