package org.unical.backend.persistance._impl.dao.jdbc;

/*
DAO implementation for Asta
 */

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.exceptions.AstaNotValidException;
import org.unical.backend.model.Asta;
import org.unical.backend.persistance._impl.dao.IDao;

import java.util.List;

@Repository
public class AstaDaoJDBC extends AbsBaseJDBC implements IDao<Asta, Integer> {

    public AstaDaoJDBC() {}

    @Override
    protected RowMapper<Asta> getRowMapper() {
        return (rs, rowNum) -> {
            Asta asta = new Asta();
            asta.setId(rs.getInt("id"));
            asta.setAnnuncio_id(rs.getInt("annuncio_id"));
            asta.setPrezzo_base(rs.getBigDecimal("prezzo_base"));
            asta.setPrezzo_corrente(rs.getBigDecimal("prezzo_corrente"));
            asta.setUltimo_offerente_id(rs.getObject("ultimo_offerente_id") != null ? rs.getInt("ultimo_offerente_id") : null);
            asta.setOfferte(rs.getString("offerte"));
            asta.setData_inizio(rs.getTimestamp("data_inizio"));
            asta.setData_fine(rs.getTimestamp("data_fine"));
            asta.setStato(rs.getString("stato"));
            return asta;
        };
    }

    @Override
    public List<Asta> findAll() {
        String sql = "SELECT * FROM asta";
        return jdbcTemplate.query(sql, this.getRowMapper());
    }

    @Override
    public Asta findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM asta WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    @Override
    public Asta save(Asta asta) throws Exception {
        checkAstaValidity(asta);

        String sql = "INSERT INTO asta (annuncio_id, prezzo_base, prezzo_corrente, ultimo_offerente_id, offerte, data_inizio, data_fine, stato) " +
            "VALUES (?, ?, ?, ?, ?::jsonb, ?, ?, ?) RETURNING *";

        return jdbcTemplate.queryForObject(sql, this.getRowMapper(),
            asta.getAnnuncio_id(),
            asta.getPrezzo_base(),
            asta.getPrezzo_corrente(),
            asta.getUltimo_offerente_id(),
            asta.getOfferte(),
            asta.getData_inizio(),
            asta.getData_fine(),
            asta.getStato()
        );
    }

    @Override
    public void delete(Asta asta) throws Exception {
        String sql = "DELETE FROM asta WHERE id = ?";
        jdbcTemplate.update(sql, asta.getId());
    }

    private static void checkAstaValidity(Asta asta) throws AstaNotValidException {
        if (asta == null) {
            throw new AstaNotValidException("Asta is null");
        } else if (asta.getAnnuncio_id() <= 0) {
            throw new AstaNotValidException("Invalid annuncio_id");
        } else if (asta.getPrezzo_base() == null || asta.getPrezzo_base().signum() < 0) {
            throw new AstaNotValidException("Invalid prezzo_base");
        } else if (asta.getData_inizio() == null || asta.getData_fine() == null) {
            throw new AstaNotValidException("Data inizio/fine mancanti");
        }
    }
}
