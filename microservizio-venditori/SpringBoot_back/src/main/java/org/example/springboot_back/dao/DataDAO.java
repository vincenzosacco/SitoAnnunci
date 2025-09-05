package org.example.springboot_back.dao;

import org.example.springboot_back.model.Data;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public class DataDAO {

    private final JdbcTemplate jdbcTemplate;

    // injetta il JdbcTemplate legato a Postgres (assicurati che il bean si chiami pgJdbcTemplate)
    public DataDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Data> findAll() {
        String sql = "SELECT id, titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, data_creazione, " +
                "longitudine, latitudine, prezzonuovo, prezzovecchio FROM annunci_backup";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToData(rs));
    }

    public Optional<Data> getById(int id) {
        String sql = "SELECT id, titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, data_creazione, " +
                "longitudine, latitudine, prezzonuovo, prezzovecchio FROM annunci_backup WHERE id = ?";
        try {
            Data data = jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> mapRowToData(rs));
            return Optional.ofNullable(data);
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    /**
     * Inserisce un annuncio. Se id = 0, lascia che Postgres generi la PK (se la tabella è configurata),
     * altrimenti usa l'id fornito.
     */
    public int save(Data d) {
        String sql = "INSERT INTO annunci_backup (titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, data_creazione, " +
                "longitudine, latitudine, prezzonuovo, prezzovecchio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, d.getTitolo());
            ps.setString(2, d.getDescrizione());
            ps.setInt(3, d.getSuperficie());
            ps.setString(4, d.getIndirizzo());
            if (d.getCategoriaId() != null) ps.setInt(5, d.getCategoriaId()); else ps.setNull(5, Types.INTEGER);
            if (d.getVenditoreId() != null) ps.setInt(6, d.getVenditoreId()); else ps.setNull(6, Types.INTEGER);

            if (d.getDataCreazione() != null)
                ps.setTimestamp(7, Timestamp.valueOf(d.getDataCreazione()));
            else
                ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));

            if (d.getLongitudine() != null) ps.setDouble(8, d.getLongitudine()); else ps.setNull(8, Types.DOUBLE);
            if (d.getLatitudine() != null) ps.setDouble(9, d.getLatitudine()); else ps.setNull(9, Types.DOUBLE);

            if (d.getPrezzoNuovo() != null) ps.setBigDecimal(10, d.getPrezzoNuovo()); else ps.setNull(10, Types.NUMERIC);
            if (d.getPrezzoVecchio() != null) ps.setBigDecimal(11, d.getPrezzoVecchio()); else ps.setNull(11, Types.NUMERIC);

            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : 0;
    }

    /**
     * Aggiorna prezzo: imposta prezzoVecchio = prezzoNuovo corrente, poi prezzoNuovo = nuovoPrezzo
     */
    public void updatePrice(int id, BigDecimal nuovoPrezzo) {
        jdbcTemplate.update("UPDATE annunci_backup SET prezzovecchio = prezzonuovo WHERE id = ?", id);
        jdbcTemplate.update("UPDATE annunci_backup SET prezzonuovo = ? WHERE id = ?", nuovoPrezzo, id);
    }

    /**
     * Aggiorna un campo specifico (column deve essere validato per evitare SQL injection)
     */
    public void updateField(int id, String column, Object nuovoValore) {
        // valida colonne ammesse (solo colonne della tabella annuncio che abbiamo deciso di esporre)
        Set<String> allowed = Set.of(
                "titolo","descrizione","superficie","indirizzo","categoria_id","venditore_id",
                "data_creazione","longitudine","latitudine","prezzonuovo","prezzovecchio"
        );
        if (!allowed.contains(column.toLowerCase())) {
            throw new IllegalArgumentException("Colonna non permessa: " + column);
        }

        String sql = "UPDATE annunci_backup SET " + column + " = ? WHERE id = ?";
        jdbcTemplate.update(sql, nuovoValore, id);
    }

    public void deleteById(int id) {
        jdbcTemplate.update("DELETE FROM annunci_backup WHERE id = ?", id);
    }

    /**
     * Legge tutte le foto (bytea) associate a un annuncio dalla tabella foto_annuncio.
     */
    public List<byte[]> findPhotosByAnnuncioId(int annuncioId) {
        String sql = "SELECT dati_bytea FROM foto_annuncio WHERE annuncio_id = ?";
        return jdbcTemplate.query(sql, new Object[]{annuncioId}, (rs, rowNum) -> rs.getBytes("dati_bytea"));
    }

    public byte[] findPhotoByAnnuncioIdAndIndex(int annuncioId, int index) {
        String sql = "SELECT dati_bytea FROM foto_annuncio WHERE annuncio_id = ? ORDER BY id ASC OFFSET ? LIMIT 1";
        List<byte[]> result = jdbcTemplate.query(sql, new Object[]{annuncioId, index},
                (rs, rowNum) -> rs.getBytes("dati_bytea"));
        return result.isEmpty() ? null : result.get(0);
    }
    // --- helper ---
    private Data mapRowToData(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String titolo = rs.getString("titolo");
        String descrizione = rs.getString("descrizione");
        int superficie = rs.getInt("superficie");
        String indirizzo = rs.getString("indirizzo");
        Integer categoriaId = rs.getObject("categoria_id") != null ? rs.getInt("categoria_id") : null;
        Integer venditoreId = rs.getObject("venditore_id") != null ? rs.getInt("venditore_id") : null;

        Timestamp ts = rs.getTimestamp("data_creazione");
        LocalDateTime dataCreazione = ts != null ? ts.toLocalDateTime() : null;

        Double longitudine = rs.getObject("longitudine") != null ? rs.getDouble("longitudine") : null;
        Double latitudine = rs.getObject("latitudine") != null ? rs.getDouble("latitudine") : null;

        BigDecimal prezzoNuovo = rs.getBigDecimal("prezzonuovo");
        BigDecimal prezzoVecchio = rs.getBigDecimal("prezzovecchio");

        return new Data(id, titolo, descrizione, superficie, indirizzo,
                categoriaId, venditoreId, dataCreazione, longitudine, latitudine,
                prezzoNuovo, prezzoVecchio);
    }

    public void updateFieldWithType(int id, String column, Object nuovoValore, int sqlType) {
        // valida colonne ammesse
        Set<String> allowed = Set.of(
                "titolo","descrizione","superficie","indirizzo","categoria_id","venditore_id",
                "data_creazione","longitudine","latitudine","prezzonuovo","prezzovecchio","foto"
        );
        if (!allowed.contains(column.toLowerCase())) {
            throw new IllegalArgumentException("Colonna non permessa: " + column);
        }

        String sql = "UPDATE annunci_backup SET " + column + " = ? WHERE id = ?";

        // se valore null, passiamo SQL NULL come tipo
        if (nuovoValore == null) {
            jdbcTemplate.update(sql, new Object[]{null, id}, new int[]{Types.NULL, Types.INTEGER});
        } else {
            jdbcTemplate.update(sql, new Object[]{nuovoValore, id}, new int[]{sqlType, Types.INTEGER});
        }
    }
}