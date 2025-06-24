/*
DAO implementation for Annuncio
 */

package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.exceptions.AnnuncioNotValidException;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Annuncio;

import java.util.List;


@Repository
public class AnnuncioDaoJDBC extends AbsBaseJDBC implements IDao<Annuncio, Integer> {

    @Override
    protected RowMapper<Annuncio> getRowMapper() {
        return (rs, rowNum) -> new Annuncio(
                rs.getInt("id"),
                rs.getString("titolo"),
                rs.getString("descrizione"),
                rs.getBigDecimal("prezzo"),
                rs.getBigDecimal("prezzo_asta"),
                rs.getInt("metri_quadri"),
                rs.getString("indirizzo"),
                rs.getBoolean("in_vendita"),
                rs.getInt("categoria_id"),
                rs.getInt("venditore_id"),
                rs.getTimestamp("data_creazione"),
                rs.getBytes("foto"),
                rs.getBoolean("promozione")
        );
    }

    @Override
    public List<Annuncio> findAll() {
        String sql = "SELECT * FROM annuncio";
        return jdbcTemplate.query(sql, (rs, rowNum) -> this.getRowMapper().mapRow(rs, rowNum));
    }

    @Override
    public Annuncio findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM annuncio WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    /**
     * Save the given {@link Annuncio} into the database.
     * @param ann The entity to save.
     * @return The saved {@link Annuncio} with the generated ID.
     */
    @Override
    public Annuncio save(Annuncio ann) {
        // CHECK VALIDITY
        checkAnnuncioValidity(ann);


        // INSERT
        String sql = "INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, metri_quadri, indirizzo, " +
            "in_vendita, categoria_id, venditore_id, data_creazione, foto, promozione) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, ann.getTitle(), ann.getDescription(), ann.getPrice());

        // SELECT and RETURN
        sql = "SELECT * FROM annuncio WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), ann.getId());

    }

    @Override
    public void delete(Annuncio ann) {
        throw new NotImplementedException();
    }

    private static void checkAnnuncioValidity(Annuncio ann) throws AnnuncioNotValidException {
        // TODO maybe i want to add a limit for values (e.g title length)
        if (ann == null) {
            throw new AnnuncioNotValidException("Annuncio is null");
        }
        else if (ann.getTitle() == null || ann.getTitle().isBlank()) {
            throw new AnnuncioNotValidException("Annuncio title is null or blank");
        }
        else if (ann.getDescription() == null || ann.getDescription().isBlank()) {
            throw new AnnuncioNotValidException("Annuncio description is null or blank");
        }
    }

}
