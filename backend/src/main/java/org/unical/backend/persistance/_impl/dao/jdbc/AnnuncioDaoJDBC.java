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

import java.math.BigDecimal;
import java.util.List;


@Repository
public class AnnuncioDaoJDBC extends ABaseJDBC implements IDao<Annuncio, Integer> {

    @Override
    protected RowMapper<Annuncio> getRowMapper() {
        return (rs, rowNum) -> new Annuncio(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("price")
        );
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
        String sql = "INSERT INTO annuncio (title, description, price) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, ann.getTitle(), ann.getDescription(), ann.getPrice());

        // SELECT and RETURN
        sql = "SELECT id, title, description, price FROM annuncio WHERE title = ? AND description = ? AND price = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), ann.getTitle(), ann.getDescription(), ann.getPrice());

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
