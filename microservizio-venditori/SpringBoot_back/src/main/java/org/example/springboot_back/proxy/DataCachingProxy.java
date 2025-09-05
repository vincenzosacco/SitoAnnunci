package org.example.springboot_back.proxy;

import org.example.springboot_back.dao.DataDAO;
import org.example.springboot_back.model.Data;
import org.springframework.stereotype.Component;

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
        cache = null;
    }

    public void createAnnuncio(Data nuovoAnnuncio) {
        dataDAO.save(nuovoAnnuncio); // salva nel database
        if (cache != null) {
            cache.add(nuovoAnnuncio); // aggiorna la cache
        }
    }

    public void updateField(int id, String column, Object nuovoValore) {
        // mantieni per compatibilità (inferisce il tipo)
        dataDAO.updateFieldWithType(id, column, nuovoValore, inferSqlType(nuovoValore));
        cache = null;
    }

    public void updateFieldWithType(int id, String column, Object nuovoValore, int sqlType) {
        dataDAO.updateFieldWithType(id, column, nuovoValore, sqlType);
        cache = null;
    }

    private int inferSqlType(Object val) {
        if (val == null) return java.sql.Types.NULL;
        if (val instanceof Integer) return java.sql.Types.INTEGER;
        if (val instanceof Double) return java.sql.Types.DOUBLE;
        if (val instanceof java.math.BigDecimal) return java.sql.Types.NUMERIC;
        if (val instanceof byte[]) return java.sql.Types.BINARY;
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

    public void invalidateCache() {
        cache = null;
    }
}