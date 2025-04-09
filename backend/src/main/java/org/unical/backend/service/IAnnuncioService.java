package org.unical.backend.service;



import org.unical.backend.model.Annuncio;

import java.util.Collection;

public interface IAnnuncioService {

    // list
    Collection<Annuncio> findAll();

    // retrieve byID
    Annuncio findById(int id);

    // create
    Annuncio createAnnuncio(Annuncio ann) throws Exception;

    // update
    Annuncio updateAnnuncio(int toUpdateAnnID, Annuncio ann) throws Exception;

    // delete
    void deleteAnnuncio(int id);


}
