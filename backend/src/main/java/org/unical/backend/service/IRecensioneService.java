package org.unical.backend.service;

import org.unical.backend.model.Recensione;

import java.util.List;

public interface IRecensioneService {
    Recensione save(Recensione recensione);

    Recensione findById(int id);

    List<Recensione> findAll();

    void delete(int id);

    List<Recensione> findByAnnuncioId(int annuncioId);
}
