package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.model.GeoLocation;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Annuncio;
import org.unical.backend.service.IAnnuncioService;

import java.util.Collection;

@Service
class AnnuncioServiceDao implements IAnnuncioService {

    private final IDao<Annuncio, Integer> dao;
    private final GeoService geoService;

    AnnuncioServiceDao(IDao<Annuncio,Integer> annDao, GeoService geoService) {
        this.dao = annDao;
        this.geoService = geoService;
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
        GeoLocation geo = geoService.getCoordinates(ann.getIndirizzo());
        ann.setLatitudine(geo.getLat());
        ann.setLongitudine(geo.getLng());
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
