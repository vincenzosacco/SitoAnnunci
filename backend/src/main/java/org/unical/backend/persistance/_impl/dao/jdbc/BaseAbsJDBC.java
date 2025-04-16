package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.unical.backend.persistance._impl.dao.IDao;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Abstract base class for all DAO JDBC implementations.
 */
@Repository
public abstract class BaseAbsJDBC {
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    public void init(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    protected abstract RowMapper getRowMapper();

}
