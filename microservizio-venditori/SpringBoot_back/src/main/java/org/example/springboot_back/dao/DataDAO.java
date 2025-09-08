package org.example.springboot_back.dao;

import org.example.springboot_back.model.Data;
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

    public DataDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Data> findAll() {
        String sql = "SELECT id, titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, data_creazione, " +
                "longitudine, latitudine, prezzo_nuovo, prezzo, in_vendita FROM annuncio";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToData(rs));
    }

    public Optional<Data> getById(int id) {
        String sql = "SELECT id, titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, data_creazione, " +
                "longitudine, latitudine, prezzo_nuovo, prezzo, in_vendita FROM annuncio WHERE id = ?";
        try {
            Data data = jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) -> mapRowToData(rs));
            return Optional.ofNullable(data);
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }
    }

    public int save(Data d) {
        String sql = "INSERT INTO annuncio (titolo, descrizione, superficie, indirizzo, categoria_id, venditore_id, " +
                "data_creazione, longitudine, latitudine, prezzo_nuovo, prezzo, in_vendita) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            // Specifico solo la colonna "id" come chiave generata
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, d.getTitolo());
            ps.setString(2, d.getDescrizione());
            ps.setInt(3, d.getSuperficie());
            ps.setString(4, d.getIndirizzo());
            if (d.getCategoriaId() != null) ps.setInt(5, d.getCategoriaId());
            else ps.setNull(5, Types.INTEGER);
            if (d.getVenditoreId() != null) ps.setInt(6, d.getVenditoreId());
            else ps.setNull(6, Types.INTEGER);
            ps.setTimestamp(7, d.getDataCreazione() != null ? Timestamp.valueOf(d.getDataCreazione()) : Timestamp.valueOf(LocalDateTime.now()));
            if (d.getLongitudine() != null) ps.setDouble(8, d.getLongitudine());
            else ps.setNull(8, Types.DOUBLE);
            if (d.getLatitudine() != null) ps.setDouble(9, d.getLatitudine());
            else ps.setNull(9, Types.DOUBLE);
            if (d.getPrezzoNuovo() != null) ps.setBigDecimal(10, d.getPrezzoNuovo());
            else ps.setNull(10, Types.NUMERIC);
            if (d.getPrezzoVecchio() != null) ps.setBigDecimal(11, d.getPrezzoVecchio());
            else ps.setNull(11, Types.NUMERIC);
            ps.setBoolean(12, d.getInVendita() != null && d.getInVendita());
            return ps;
        }, keyHolder);

        // Leggo la chiave generata in modo sicuro
        Number key = keyHolder.getKey();
        return key != null ? key.intValue() : 0;
    }

    public void updatePrice(int id, BigDecimal nuovoPrezzo) {
        jdbcTemplate.update("UPDATE annuncio SET prezzo = prezzo_nuovo WHERE id = ?", id);
        jdbcTemplate.update("UPDATE annuncio SET prezzo_nuovo = ? WHERE id = ?", nuovoPrezzo, id);
    }

    public void updateField(int id, String column, Object nuovoValore) {
        Set<String> allowed = Set.of(
                "titolo", "descrizione", "superficie", "indirizzo", "categoria_id", "venditore_id",
                "data_creazione", "longitudine", "latitudine", "prezzo_nuovo", "prezzo", "in_vendita"
        );
        if (!allowed.contains(column.toLowerCase())) {
            throw new IllegalArgumentException("Colonna non permessa: " + column);
        }
        String sql = "UPDATE annuncio SET " + column + " = ? WHERE id = ?";
        jdbcTemplate.update(sql, nuovoValore, id);
    }

    public void updateFieldWithType(int id, String column, Object nuovoValore, int sqlType) {
        Set<String> allowed = Set.of(
                "titolo", "descrizione", "superficie", "indirizzo", "categoria_id", "venditore_id",
                "data_creazione", "longitudine", "latitudine", "prezzo_nuovo", "prezzo", "in_vendita"
        );
        if (!allowed.contains(column.toLowerCase())) {
            throw new IllegalArgumentException("Colonna non permessa: " + column);
        }

        String sql = "UPDATE annuncio SET " + column + " = ? WHERE id = ?";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            if (nuovoValore == null) {
                ps.setNull(1, sqlType);
            } else {
                switch (sqlType) {
                    case Types.INTEGER -> {
                        if (nuovoValore instanceof Integer) {
                            ps.setInt(1, (Integer) nuovoValore);
                        } else if (nuovoValore instanceof String) {
                            ps.setInt(1, Integer.parseInt((String) nuovoValore));
                        } else {
                            throw new IllegalArgumentException("Valore non convertibile in INTEGER: " + nuovoValore);
                        }
                    }
                    case Types.DOUBLE -> ps.setDouble(1, (Double) nuovoValore);
                    case Types.NUMERIC -> ps.setBigDecimal(1, (BigDecimal) nuovoValore);
                    case Types.BINARY -> ps.setBytes(1, (byte[]) nuovoValore);
                    case Types.BOOLEAN -> ps.setBoolean(1, (Boolean) nuovoValore);
                    case Types.VARCHAR -> ps.setString(1, nuovoValore.toString());
                    case Types.TIMESTAMP -> ps.setTimestamp(1, Timestamp.valueOf((LocalDateTime) nuovoValore));
                    default -> ps.setObject(1, nuovoValore);
                }
            }
            ps.setInt(2, id);
            return ps;
        });
    }

    public void deleteById(int id) {
        jdbcTemplate.update("DELETE FROM annuncio WHERE id = ?", id);
    }

    public List<byte[]> findPhotosByAnnuncioId(int annuncioId) {
        String sql = "SELECT dati_bytea FROM foto_annuncio WHERE annuncio_id = ?";
        return jdbcTemplate.query(sql, new Object[]{annuncioId}, (rs, rowNum) -> rs.getBytes("dati_bytea"));
    }

    public byte[] findPhotoByAnnuncioIdAndIndex(int annuncioId, int index) {
        String sql = "SELECT dati_bytea FROM foto_annuncio WHERE annuncio_id = ? ORDER BY id ASC OFFSET ? LIMIT 1";
        List<byte[]> result = jdbcTemplate.query(sql, new Object[]{annuncioId, index}, (rs, rowNum) -> rs.getBytes("dati_bytea"));
        return result.isEmpty() ? null : result.get(0);
    }

    public void addPhoto(int annuncioId, byte[] fotoBytes) {
        String sql = "INSERT INTO foto_annuncio (annuncio_id, dati_bytea) VALUES (?, ?)";
        jdbcTemplate.update(sql, annuncioId, fotoBytes);
    }

    public boolean deletePhoto(int annuncioId, byte[] fotoBytes) {
        String sql = "DELETE FROM foto_annuncio WHERE annuncio_id = ? AND dati_bytea = ?";
        int rowsAffected = jdbcTemplate.update(sql, annuncioId, fotoBytes);
        return rowsAffected > 0;
    }

    // --- mapping con categoriaTipo e inVendita ---
    private Data mapRowToData(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String titolo = rs.getString("titolo");
        String descrizione = rs.getString("descrizione");
        int superficie = rs.getInt("superficie");
        String indirizzo = rs.getString("indirizzo");
        Integer categoriaId = rs.getObject("categoria_id") != null ? rs.getInt("categoria_id") : null;
        String categoriaTipo = getCategoriaTipoById(categoriaId);
        Integer venditoreId = rs.getObject("venditore_id") != null ? rs.getInt("venditore_id") : null;
        Timestamp ts = rs.getTimestamp("data_creazione");
        LocalDateTime dataCreazione = ts != null ? ts.toLocalDateTime() : null;
        Double longitudine = rs.getObject("longitudine") != null ? rs.getDouble("longitudine") : null;
        Double latitudine = rs.getObject("latitudine") != null ? rs.getDouble("latitudine") : null;
        BigDecimal prezzo_nuovo = rs.getBigDecimal("prezzo_nuovo");
        BigDecimal prezzoVecchio = rs.getBigDecimal("prezzo");
        Boolean inVendita = rs.getObject("in_vendita") != null ? rs.getBoolean("in_vendita") : false;

        return new Data(id, titolo, descrizione, superficie, indirizzo,
                categoriaId, categoriaTipo, venditoreId, dataCreazione,
                longitudine, latitudine, prezzo_nuovo, prezzoVecchio, inVendita);
    }

    public String getCategoriaTipoById(Integer categoriaId) {
        if (categoriaId == null) return null;
        String sql = "SELECT tipo FROM categoria_immobile WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{categoriaId}, String.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void addAsta(int annuncioId, BigDecimal prezzoBase) {
        String sql = "INSERT INTO asta (annuncio_id, prezzo_base) VALUES (?, ?)";
        jdbcTemplate.update(sql, annuncioId, prezzoBase);
    }
}