package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.exceptions.NotImplementedException;
import org.unical.backend.model.Utente;
import org.unical.backend.persistance._impl.dao.IDao;

import java.util.List;

@Repository
public class UtenteDaoJDBC extends AbsBaseJDBC implements IDao<Utente, Integer> {

    @Override
    protected RowMapper<Utente> getRowMapper() {
        return (rs, rowNum) -> new Utente(
            rs.getInt("id"),
            rs.getString("nome"),
            rs.getString("cellulare"),
            rs.getString("email"),
            rs.getString("password"),
            rs.getInt("ruolo_id"),
            rs.getBoolean("bannato")
        );
    }

    @Override
    public List<Utente> findAll() {
        String sql = "SELECT * FROM utente";
        return jdbcTemplate.query(sql, this.getRowMapper());
    }

    @Override
    public Utente findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM utente WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    @Override
    public Utente save(Utente utente) {

        String sql = "INSERT INTO utente (nome, cellulare, email, password, ruolo_id, bannato) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            utente.getNome(),
            utente.getEmail(),
            utente.getPassword(),
            utente.getRuolo_id(),
            utente.isBannato()
        );

        String sqlReturn = "SELECT * FROM utente WHERE email = ?";
        return jdbcTemplate.queryForObject(sqlReturn, this.getRowMapper(), utente.getEmail());
    }

    @Override
    public void delete(Utente utente) {
        throw new NotImplementedException();
    }
}
