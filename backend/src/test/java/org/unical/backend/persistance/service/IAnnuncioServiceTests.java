package org.unical.backend.persistance.service;

import org.unical.backend.model.Annuncio;

import java.util.Collection;

public interface IAnnuncioServiceTests{
    // list
    Collection<Annuncio> testFindAll();


    // create
    Annuncio testCreateAnnuncio(Annuncio ann) throws Exception;

    // update
    Annuncio testUpdateAnnuncio(int toUpdateAnnID, Annuncio ann) throws Exception;

    // delete
    void testDeleteAnnuncio(int id);

}
