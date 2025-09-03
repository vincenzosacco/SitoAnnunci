package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.model.Foto;
import org.unical.backend.persistance._impl.dao.IDao;

import java.util.List;

@Repository
public class FotoDaoJDBC extends AbsBaseJDBC implements IDao<Foto, Integer> {

    @Override
    protected RowMapper<Foto> getRowMapper() {
        return (rs, rowNum) -> new Foto(
            rs.getInt("id"),
            rs.getInt("annuncio_id"),
            rs.getBytes("dati")
        );
    }

    @Override
    public List<Foto> findAll() {
        String sql = "SELECT * FROM foto";
        return jdbcTemplate.query(sql, getRowMapper());
    }

    @Override
    public Foto findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM foto WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, getRowMapper(), id);
    }

    @Override
    public Foto save(Foto foto) {
        String sql = "INSERT INTO foto (path, annuncio_id) VALUES (?, ?) RETURNING *";
        return jdbcTemplate.queryForObject(sql, getRowMapper(), foto.getAnnuncio_id(), foto.getDati());
    }

    @Override
    public void delete(Foto foto) {
        String sql = "DELETE FROM foto WHERE id = ?";
        jdbcTemplate.update(sql, foto.getId());
    }

    public List<Foto> findByAnnuncioId(int annuncioId) {
        String sql = "SELECT * FROM foto WHERE annuncio_id = ?";
        return jdbcTemplate.query(sql, getRowMapper(), annuncioId);
    }

    public void deleteByAnnuncioId(int annuncioId) {
        String sql = "DELETE FROM foto WHERE annuncio_id = ?";
        jdbcTemplate.update(sql, annuncioId);
    }
}
