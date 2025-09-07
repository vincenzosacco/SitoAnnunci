package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.model.Utente;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.service.IUtenteService;

import java.util.Collection;

@Service
class UtenteServiceDao implements IUtenteService {

    private final IDao<Utente, Integer> dao;

    UtenteServiceDao(IDao<Utente, Integer> utenteDao) {this.dao = utenteDao;}

    @Override
    public Collection<Utente> findAll() {
        return dao.findAll();
    }

    @Override
    public Utente findById(int id) {
        return dao.findByPrimaryKey(id);
    }

    @Override
    public Utente findByEmail(String email) {
        return dao.findAll().stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst().orElse(null);
    }

    @Override
    public Utente createUtente(Utente u) throws Exception {
        return dao.save(u);
    }

    @Override
    public Utente updateUtente(int id, Utente u) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteUtente(int id) {
        throw new NotImplementedException();
    }
}
