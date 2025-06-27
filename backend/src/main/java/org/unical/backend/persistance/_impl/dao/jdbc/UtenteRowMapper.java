package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.jdbc.core.RowMapper;
import org.unical.backend.model.Utente;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UtenteRowMapper implements RowMapper<Utente> {

    @Override
    public Utente mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Utente(
            rs.getInt("id"),
            rs.getString("nome"),
            rs.getString("email"),
            rs.getString("password"),
            rs.getInt("ruolo_id"),
            rs.getBoolean("bannato")
        );
    }

}
