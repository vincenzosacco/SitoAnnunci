package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAnnuncioService;
import org.unical.backend.service.IFotoService;

import java.util.Collection;

@Service
class AnnuncioServiceDao implements IAnnuncioService {

    private final IDao<Annuncio, Integer> dao;
    private final IFotoService fotoService;

    public AnnuncioServiceDao(IDao<Annuncio,Integer> annDao, IFotoService fotoService) {
        this.dao = annDao;
        this.fotoService = fotoService;
    }

    @Override
    public Collection<Annuncio>findAll() {
        Collection<Annuncio> annunci = dao.findAll();
        for (Annuncio ann : annunci) {
            ann.setFoto(fotoService.findByAnnuncioId(ann.getId()));
        }
        return annunci;
    }

    @Override
    public Annuncio findById(int id) {
        Annuncio ann = dao.findByPrimaryKey(id);
        ann.setFoto(fotoService.findByAnnuncioId(id));
        return ann;
    }

    @Override
    public Annuncio createAnnuncio(Annuncio ann) throws Exception {
        return dao.save(ann);
    }

    @Override
    public Annuncio updateAnnuncio(int toUpdateAnnID, Annuncio ann)  {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAnnuncio(int id) {
//        return dao.delete();
        throw new NotImplementedException();
    }

}
