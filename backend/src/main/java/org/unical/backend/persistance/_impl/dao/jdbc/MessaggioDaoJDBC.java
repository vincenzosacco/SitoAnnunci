/*
DAO implementation for Messaggio
 */

package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.unical.backend.model.Utente;
import org.unical.backend.persistance._impl.dao.IDao;
import org.unical.backend.model.Messaggio;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;


@Repository
public class MessaggioDaoJDBC extends AbsBaseJDBC implements IDao<Messaggio, Integer> {

    @Autowired
    private UtenteDaoJDBC utenteDao;

    @Override
    protected RowMapper<Messaggio> getRowMapper() {
        return (rs, rowNum) -> new Messaggio(
            rs.getInt("id"),
            rs.getInt("mittente_id"),
            rs.getInt("destinatario_id"),
            rs.getString("testo"),
            rs.getTimestamp("data"),
            rs.getInt("conversazione_id")
        );
    }

    @Override
    public List<Messaggio> findAll() {
        String sql = "SELECT * FROM messaggio";
        return jdbcTemplate.query(sql, (rs, rowNum) -> this.getRowMapper().mapRow(rs, rowNum));
    }

    @Override
    public Messaggio findByPrimaryKey(Integer id) {
        String sql = "SELECT * FROM messaggio WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, this.getRowMapper(), id);
    }

    /**
     * Save the given {@link Messaggio} into the database.
     * @param messaggio The entity to save.
     * @return The saved {@link Messaggio} with the generated ID.
     */
    @Override
    public Messaggio save(Messaggio messaggio) {

        // INSERT
        final String insertSql = "INSERT INTO messaggio (mittente_id, destinatario_id, testo, data, conversazione_id) " +
            "VALUES (?, ?, ?, ?, ?)";
        Timestamp now = messaggio.getDate() != null ? messaggio.getDate() : new Timestamp(System.currentTimeMillis());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, messaggio.getSenderId());
            ps.setInt(2, messaggio.getAddresseeId());
            ps.setString(3, messaggio.getText());
            ps.setTimestamp(4, now);
            ps.setInt(5, messaggio.getConversationId());
            return ps;
        }, keyHolder);

        Number id = (Number) keyHolder.getKeys().get("id");

        // SELECT and RETURN
        final String selectSql = "SELECT * FROM messaggio WHERE id = ?";
        return jdbcTemplate.queryForObject(selectSql, this.getRowMapper(), id);
    }


    public List<Messaggio> findMessaggiByConversazioneId(int conversazioneId) {

        String sql = "SELECT * FROM messaggio WHERE conversazione_id = ? ORDER BY data ASC";
        return jdbcTemplate.query(sql, this.getRowMapper(), conversazioneId);
    }

    public List<Utente> getConversazioniUtente(int utenteId) {
        String sql = """
        SELECT u.*, c.id as conversazione_id
        FROM utente u
        JOIN conversazione c ON (u.id = c.utente1_id OR u.id = c.utente2_id)
        WHERE ? IN (c.utente1_id, c.utente2_id)
        AND u.id != ?
    """;
        return jdbcTemplate.query(sql, utenteDao.getRowMapper(), utenteId, utenteId);
    }

    public Integer getConversazioneId(int utente1Id, int utente2Id) {
        int minId = Math.min(utente1Id, utente2Id);
        int maxId = Math.max(utente1Id, utente2Id);

        String sql = """
        SELECT id FROM conversazione
        WHERE utente1_id = ? AND utente2_id = ?
    """;

        List<Integer> results = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt("id"), minId, maxId);
        return results.isEmpty() ? null : results.get(0);
    }

    public int createConversazione(int utente1Id, int utente2Id) {
        int minId = Math.min(utente1Id, utente2Id);
        int maxId = Math.max(utente1Id, utente2Id);

        String insertSql = "INSERT INTO conversazione (utente1_id, utente2_id) VALUES (?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, minId);
            ps.setInt(2, maxId);
            return ps;
        }, keyHolder);

        return ((Number) keyHolder.getKeys().get("id")).intValue();
    }


    @Override
    public void delete(Messaggio messaggio) {
        String sql = "DELETE FROM messaggio WHERE id = ?";
        jdbcTemplate.update(sql, messaggio.getId());
    }


}
