package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.exceptions.AstaNotValidException;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.model.Asta;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.service.IAstaService;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collection;

@Service
public class AstaServiceDao implements IAstaService {

    private final IDao<Asta, Integer> dao;

    public AstaServiceDao(IDao<Asta, Integer> astaDao) {
        this.dao = astaDao;
    }

    @Override
    public Collection<Asta> findAll() {
        return dao.findAll();
    }

    @Override
    public Asta findById(int id) {
        return dao.findByPrimaryKey(id);
    }

    @Override
    public Asta createAsta(Asta asta) throws Exception {
        if (asta.getPrezzo_corrente() == null) {
            asta.setPrezzo_corrente(asta.getPrezzo_base());
        }
        if (asta.getStato() == null) {
            asta.setStato("ATTIVA");
        }
        if (asta.getData_inizio() == null) {
            asta.setData_inizio(Timestamp.from(Instant.now()));
        }
        return dao.save(asta);
    }

    @Override
    public Asta updateAsta(int toUpdateAstaID, Asta asta) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAsta(int id) {
        throw new NotImplementedException();
    }

    @Override
    public Asta makeOffer(int idAsta, int idOfferente, BigDecimal importo) throws Exception {
        Asta asta = dao.findByPrimaryKey(idAsta);

        if (asta == null) {
            throw new AstaNotValidException("Asta non trovata");
        }
        if (!"ATTIVA".equalsIgnoreCase(asta.getStato())) {
            throw new AstaNotValidException("Asta non attiva");
        }
        if (importo.compareTo(asta.getPrezzo_corrente()) <= 0) {
            throw new AstaNotValidException("Offerta troppo bassa");
        }

        // aggiorno i dati principali
        asta.setPrezzo_corrente(importo);
        asta.setUltimo_offerente_id(idOfferente);
        asta.setData_fine(Timestamp.from(Instant.now().plusSeconds(15 * 60))); // estensione 15 min

        return dao.save(asta);
    }
}
