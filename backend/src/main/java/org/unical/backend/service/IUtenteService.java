package org.unical.backend.service;

import org.unical.backend.model.Utente;

import java.util.Collection;

public interface IUtenteService {
    Collection<Utente> findAll();
    Utente findById(int id);
    Utente createUtente(Utente u) throws Exception;
    Utente updateUtente(int id, Utente u);
    void deleteUtente(int id);
}
