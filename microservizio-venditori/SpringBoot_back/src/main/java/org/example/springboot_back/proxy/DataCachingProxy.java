package org.example.springboot_back.proxy;

import org.example.springboot_back.dao.DataDAO;
import org.example.springboot_back.model.Data;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Component
public class DataCachingProxy {

    private final DataDAO dataDAO;
    private List<Data> cache;

    public DataCachingProxy(DataDAO dataDAO) {
        this.dataDAO = dataDAO;
    }

    private void initCacheIfNeeded() {
        if (cache == null) {
            cache = dataDAO.findAll();
        }
    }

    public List<Data> findAll() {
        initCacheIfNeeded();
        return cache;
    }

    public Optional<Data> getById(int id) {
        initCacheIfNeeded();
        return cache.stream().filter(d -> d.getId() == id).findFirst();
    }

    public void updatePrice(int id, BigDecimal nuovoPrezzo) {
        dataDAO.updatePrice(id, nuovoPrezzo);
        invalidateCache();
    }

    public void createAnnuncio(Data nuovoAnnuncio) {
        int generatedId = dataDAO.save(nuovoAnnuncio); // salva nel database e ottiene ID
        nuovoAnnuncio.setId(generatedId);
        if (cache != null) {
            cache.add(nuovoAnnuncio); // aggiorna la cache
        }
    }

    public void updateField(int id, String column, Object nuovoValore) {
        dataDAO.updateFieldWithType(id, column, nuovoValore, inferSqlType(nuovoValore));
        invalidateCache();
    }

    public void updateFieldWithType(int id, String column, Object nuovoValore, int sqlType) {
        dataDAO.updateFieldWithType(id, column, nuovoValore, sqlType);
        invalidateCache();
    }

    private int inferSqlType(Object val) {
        if (val == null) return java.sql.Types.NULL;
        if (val instanceof Integer) return java.sql.Types.INTEGER;
        if (val instanceof Double) return java.sql.Types.DOUBLE;
        if (val instanceof BigDecimal) return java.sql.Types.NUMERIC;
        if (val instanceof byte[]) return java.sql.Types.BINARY;
        if (val instanceof Boolean) return java.sql.Types.BOOLEAN;
        return java.sql.Types.VARCHAR;
    }

    public void deleteById(int id) {
        dataDAO.deleteById(id);
        if (cache != null) {
            cache.removeIf(d -> d.getId() == id);
        }
    }

    public List<byte[]> findPhotosByAnnuncioId(int annuncioId) {
        return dataDAO.findPhotosByAnnuncioId(annuncioId);
    }

    public byte[] getPhotoByAnnuncioIdAndIndex(int annuncioId, int index) {
        return dataDAO.findPhotoByAnnuncioIdAndIndex(annuncioId, index);
    }

    public void addPhoto(int annuncioId, byte[] fotoBytes) {
        dataDAO.addPhoto(annuncioId, fotoBytes);
        invalidateCache();
    }

    public boolean removePhotoByIndex(int annuncioId, int index) {
        byte[] foto = dataDAO.findPhotoByAnnuncioIdAndIndex(annuncioId, index);
        if (foto == null) {
            return false;
        }
        boolean removed = dataDAO.deletePhoto(annuncioId, foto);
        invalidateCache();
        return removed;
    }

    public void invalidateCache() {
        cache = null;
    }

    // Aggiornamento specifico per inVendita
    public void setInVendita(int id, boolean inVendita) {
        updateField(id, "in_vendita", inVendita);
    }

    // proxy
    public void addAsta(int annuncioId, BigDecimal prezzoBase) {
        dataDAO.addAsta(annuncioId, prezzoBase);
        invalidateCache();
    }
}