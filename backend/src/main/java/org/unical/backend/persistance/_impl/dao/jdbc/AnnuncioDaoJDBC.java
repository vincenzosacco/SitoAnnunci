/*
DAO implementation for Annuncio
 */

package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Annuncio;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;


@Repository
public class AnnuncioDaoJDBC extends BaseAbsJDBC implements IDao<Annuncio, Integer> {

    @Override
    protected RowMapper<Annuncio> getRowMapper() {
        return new RowMapper<Annuncio>() {
            @Override
            public Annuncio mapRow(ResultSet rs, int rowNum) throws SQLException {
                return new Annuncio(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("price")
                );
            }
        };
    }

    @Override
    public List<Annuncio> findAll() {
        String sql = "SELECT * FROM annuncio";
        return jdbcTemplate.query(sql, (rs, rowNum) -> this.getRowMapper().mapRow(rs, rowNum));
    }

    @Override
    public Annuncio findByPrimaryKey(Integer id) {
        String sql = "SELECT id, title, description, price FROM annuncio WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    @Override
    public void save(Annuncio ann) {
    }

    @Override
    public void delete(Annuncio ann) {

    }


}
