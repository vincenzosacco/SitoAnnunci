/*
DAO interface for Annuncio
 */

package org.unical.backend.persistance._internal.dao;

import org.unical.backend.model.Annuncio;

import java.util.List;


public interface AnnuncioDao {
    public List<Annuncio> findAll();

    public Annuncio findByPrimaryKey(int id);

    public void save(Annuncio ann);

    public void delete(Annuncio ann);

//    List<Annuncio> findAllByRistoranteName(String name);
}
