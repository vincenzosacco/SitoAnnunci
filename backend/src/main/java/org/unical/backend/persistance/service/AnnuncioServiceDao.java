package org.unical.backend.persistance.service;

import org.springframework.stereotype.Service;
import org.unical.backend.persistance._internal.dao.AnnuncioDao;
import org.unical.backend.model.Annuncio;

import java.util.Collection;

@Service
class AnnuncioServiceDao implements IAnnuncioService {

    //opzione autowiring 1
//    @Autowired
//    private AnnuncioDao dao;

    // opzione autowiring 2
    private final AnnuncioDao dao;

    AnnuncioServiceDao(AnnuncioDao annDao) {
        this.dao = annDao;
    }

    @Override
    public Collection<Annuncio>findAll() {
        return dao.findAll();
    }

    @Override
    public Annuncio findById(int id) {
        return dao.findByPrimaryKey(id);
    }

    @Override
    public Annuncio createAnnuncio(Annuncio ann) throws Exception {
        return null;
    }

    @Override
    public Annuncio updateAnnuncio(int toUpdateAnnID, Annuncio ann) throws Exception {
        return null;
    }

    @Override
    public void deleteAnnuncio(int id) {

    }

}
