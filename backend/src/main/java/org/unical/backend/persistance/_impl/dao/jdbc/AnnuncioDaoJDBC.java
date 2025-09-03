/*
DAO implementation for Annuncio
 */

package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.exceptions.AnnuncioNotValidException;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Annuncio;

import java.util.List;


@Repository
public class AnnuncioDaoJDBC extends AbsBaseJDBC implements IDao<Annuncio, Integer> {

    private final FotoDaoJDBC fotoDao;

    public AnnuncioDaoJDBC(FotoDaoJDBC fotoDao) {
        this.fotoDao = fotoDao;
    }

    @Override
    protected RowMapper<Annuncio> getRowMapper() {
        return (rs, rowNum) -> {
            Annuncio ann = new Annuncio();
            ann.setId(rs.getInt("id"));
            ann.setTitolo(rs.getString("titolo"));
            ann.setDescrizione(rs.getString("descrizione"));
            ann.setPrezzo(rs.getBigDecimal("prezzo"));
            ann.setPrezzo_asta(rs.getBigDecimal("prezzo_asta"));
            ann.setSuperficie(rs.getInt("superficie"));
            ann.setIndirizzo(rs.getString("indirizzo"));
            ann.setLatitudine(rs.getDouble("latitudine"));
            ann.setLongitudine(rs.getDouble("longitudine"));
            ann.setIn_vendita(rs.getBoolean("in_vendita"));
            ann.setCategoria_id(rs.getInt("categoria_id"));
            ann.setVenditore_id(rs.getInt("venditore_id"));
            ann.setData_creazione(rs.getTimestamp("data_creazione"));
            ann.setPromozione(rs.getBoolean("promozione"));

            ann.setFoto(fotoDao.findByAnnuncioId(ann.getId()));

            return ann;
        };
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
        String sql = "INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, superficie, indirizzo, " +
            "latitudine, longitudine, in_vendita, categoria_id, venditore_id, data_creazione, promozione) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, ann.getTitolo(), ann.getDescrizione(), ann.getPrezzo(),
            ann.getSuperficie(), ann.getIndirizzo(), ann.getLatitudine(), ann.getLongitudine());

        // SELECT and RETURN
        sql = "SELECT * FROM annuncio WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), ann.getId());

    }

    @Override
    public void delete(Annuncio ann) {
        String sql = "DELETE FROM annuncio WHERE id = ?";
        jdbcTemplate.update(sql, ann.getId());
        fotoDao.deleteByAnnuncioId(ann.getId());
    }

    private static void checkAnnuncioValidity(Annuncio ann) throws AnnuncioNotValidException {
        // TODO maybe i want to add a limit for values (e.g title length)
        if (ann == null) {
            throw new AnnuncioNotValidException("Annuncio is null");
        }
        else if (ann.getTitolo() == null || ann.getTitolo().isBlank()) {
            throw new AnnuncioNotValidException("Annuncio title is null or blank");
        }
        else if (ann.getDescrizione() == null || ann.getDescrizione().isBlank()) {
            throw new AnnuncioNotValidException("Annuncio description is null or blank");
        }
    }

}
