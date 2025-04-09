/*
DAO implementation for Annuncio
 */

package org.unical.backend.persistance.dao.jdbc;

import org.springframework.stereotype.Component;
import org.unical.backend.persistance.DBManager;
import org.unical.backend.persistance.dao.AnnuncioDao;
import org.unical.backend.model.Annuncio;

import java.sql.Connection;
import java.util.List;


@Component
public class AnnuncioDaoJDBC implements AnnuncioDao {
    Connection connection;


    public AnnuncioDaoJDBC(){
        this.connection = DBManager.getInstance().getConnection();
    }

    @Override
    public List<Annuncio> findAll() {
        return List.of();
    }

    @Override
    public Annuncio findByPrimaryKey(int id) {
        return new Annuncio(id, "Title"+id);
    }

    @Override
    public void save(Annuncio ann) {
    }

    @Override
    public void delete(Annuncio ann) {

    }


}
