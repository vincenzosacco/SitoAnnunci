package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.model.Messaggio;
import org.unical.backend.model.Utente;
import org.unical.backend.persistance._impl.dao.jdbc.MessaggioDaoJDBC;
import org.unical.backend.service.IMessaggioService;

import java.util.List;

@Service
public class MessaggioServiceDao implements IMessaggioService {

    private final MessaggioDaoJDBC dao;

    public MessaggioServiceDao(MessaggioDaoJDBC dao) {
        this.dao = dao;
    }

    @Override
    public List<Messaggio> getMessaggiByConversazione(int conversazioneId) {
        return dao.findMessaggiByConversazioneId(conversazioneId);
    }

    @Override
    public int getOrCreateConversazioneId(int utente1Id, int utente2Id) {
        return dao.getOrCreateConversazioneId(utente1Id, utente2Id);
    }

    @Override
    public Messaggio inviaMessaggio(Messaggio messaggio) {
        int conversazioneId = dao.getOrCreateConversazioneId(messaggio.getSenderId(), messaggio.getAddresseeId());
        messaggio.setConversationId(conversazioneId);
        return dao.save(messaggio);
    }

    @Override
    public List<Utente> getConversazioniUtente(int utenteId) {
        return dao.getConversazioniUtente(utenteId);
    }

}

