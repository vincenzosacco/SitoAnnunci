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
    public Messaggio inviaMessaggio(Messaggio messaggio) {
        int conversazioneId = dao.getConversazioneId(messaggio.getSenderId(), messaggio.getAddresseeId());

        if (conversazioneId == 0) {
            conversazioneId = dao.createConversazione(messaggio.getSenderId(), messaggio.getAddresseeId());
        }

        messaggio.setConversationId(conversazioneId);
        return dao.save(messaggio);
    }

    @Override
    public List<Utente> getConversazioniUtente(int utenteId) {
        return dao.getConversazioniUtente(utenteId);
    }

    @Override
    public int getConversazioneId(int utente1Id, int utente2Id) {
        Integer id = dao.getConversazioneId(utente1Id, utente2Id);
        return id != null ? id : dao.createConversazione(utente1Id, utente2Id);
    }

}

