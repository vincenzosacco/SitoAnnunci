package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.model.Recensione;
import org.unical.backend.persistance._impl.dao.jdbc.RecensioneDaoJDBC;
import org.unical.backend.service.IRecensioneService;

import java.util.List;

@Service
public class RecensioneServiceDao implements IRecensioneService {
    private final RecensioneDaoJDBC dao;

    public RecensioneServiceDao(RecensioneDaoJDBC dao) {
        this.dao = dao;
    }

    @Override
    public Recensione save(Recensione recensione) {
        return dao.save(recensione);
    }

    @Override
    public Recensione findById(int id) {
        return dao.findByPrimaryKey(id);
    }

    @Override
    public List<Recensione> findAll() {
        return dao.findAll();
    }

    @Override
    public void delete(int id) {
        Recensione recensione = dao.findByPrimaryKey(id);
        if (recensione != null) {
            dao.delete(recensione);
        } else {
            throw new IllegalArgumentException("Recensione con ID " + id + " non trovata");
        }
    }

    @Override
    public List<Recensione> findByAnnuncioId(int annuncioId) {
        return dao.findByAnnuncioId(annuncioId);
    }
}
