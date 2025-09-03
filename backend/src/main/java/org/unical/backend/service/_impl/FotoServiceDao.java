package org.unical.backend.service._impl;

import org.springframework.stereotype.Service;
import org.unical.backend.model.Foto;
import org.unical.backend.persistance._impl.dao.jdbc.FotoDaoJDBC;
import org.unical.backend.service.IFotoService;

import java.util.Base64;
import java.util.Collection;

@Service
public class FotoServiceDao implements IFotoService {

    private final FotoDaoJDBC fotoDao;

    public FotoServiceDao(FotoDaoJDBC fotoDao) {
        this.fotoDao = fotoDao;
    }

    @Override
    public Collection<Foto> findAll(){
        return fotoDao.findAll();
    }

    @Override
    public Foto findById(int id){
        return fotoDao.findByPrimaryKey(id);
    }

    @Override
    public Collection<Foto> findByAnnuncioId(int annuncio_id){
        return fotoDao.findByAnnuncioId(annuncio_id);
    }

    @Override
    public Foto createFoto(Foto foto){
        return fotoDao.save(foto);
    }

    @Override
    public void deleteFoto(int id) {
        Foto toDelete = fotoDao.findByPrimaryKey(id);
        fotoDao.delete(toDelete);
    }

    @Override
    public void deleteByAnnuncioId(int annuncioId) {
        fotoDao.deleteByAnnuncioId(annuncioId);
    }

    @Override
    public String convertToBase64(Foto foto) {
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(foto.getDati());
    }

}
