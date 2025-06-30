package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.model.Recensione;
import org.unical.backend.persistance._impl.dao.IDao;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class RecensioneDaoJDBC extends AbsBaseJDBC implements IDao<Recensione, Integer> {


    @Override
    protected RowMapper<Recensione> getRowMapper() {
        return (rs, rowNum) -> new Recensione(
            rs.getInt("id"),
            rs.getInt("annuncio_id"),
            rs.getInt("autore_id"),
            rs.getString("nome_autore"),
            rs.getString("testo"),
            rs.getInt("voto"),
            rs.getTimestamp("data")
        );
    }

    @Override
    public List<Recensione> findAll() {
        String sql = "SELECT * FROM recensione";
        return jdbcTemplate.query(sql, this.getRowMapper());
    }

    @Override
    public Recensione findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM recensione WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    public List<Recensione> findByAnnuncioId(int annuncioId) {
        String sql = "SELECT * FROM recensione WHERE annuncio_id = ? ORDER BY data DESC";
        return jdbcTemplate.query(sql, this.getRowMapper(), annuncioId);
    }

    @Override
    public Recensione save(Recensione recensione) {
        if (recensione.getData() == null) {
            recensione.setData(new Timestamp(System.currentTimeMillis()));
        }

        String sql = "INSERT INTO recensione (annuncio_id, autore_id, nome_autore, testo, voto, data) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            recensione.getAnnuncio_id(),
            recensione.getAutore_id(),
            recensione.getNome_autore(),
            recensione.getTesto(),
            recensione.getVoto(),
            recensione.getData()
        );


        String sqlReturn = "SELECT * FROM recensione WHERE id = (SELECT MAX(id) FROM recensione)";
        return jdbcTemplate.queryForObject(sqlReturn, this.getRowMapper());
    }

    @Override
    public void delete(Recensione recensione) {
        String sql = "DELETE FROM recensione WHERE id = ?";
        jdbcTemplate.update(sql, recensione.getId());
    }
}
