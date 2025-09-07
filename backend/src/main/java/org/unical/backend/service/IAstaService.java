package org.unical.backend.service;

import org.unical.backend.model.Asta;

import java.math.BigDecimal;
import java.util.Collection;

public interface IAstaService {

    Collection<Asta> findAll();

    Asta findById(int id);

    Asta createAsta(Asta asta) throws Exception;

    Asta updateAsta(int toUpdateAstaID, Asta asta);

    void deleteAsta(int id);

    Asta makeOffer(int idAsta, int idOfferente, BigDecimal importo) throws Exception;
}
