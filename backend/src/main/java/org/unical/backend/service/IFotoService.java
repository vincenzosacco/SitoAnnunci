package org.unical.backend.service;

import org.unical.backend.model.Foto;

import java.util.Collection;

public interface IFotoService {

    Collection<Foto> findAll();

    Foto findById(int id);

    Collection<Foto> findByAnnuncioId(int  annuncio_id);

    Foto createFoto(Foto foto) throws Exception;

    void deleteFoto(int id);

    void deleteByAnnuncioId(int annuncio_id);

    String convertToBase64(Foto foto);
}
