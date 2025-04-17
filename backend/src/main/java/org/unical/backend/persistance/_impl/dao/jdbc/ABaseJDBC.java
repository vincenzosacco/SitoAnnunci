package org.unical.backend.persistance._impl.dao.jdbc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;

/**
 * Abstract base class for all DAO JDBC implementations.
 */
@Repository
public abstract class ABaseJDBC {
    protected JdbcTemplate jdbcTemplate;

    @Autowired
    public void init(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    /**
     * Get the RowMapper for the entity.
     * It is used to map the ResultSet to the entity.
     * Ref: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/RowMapper.html
     * @return RowMapper object
     */
    protected abstract RowMapper getRowMapper();

}
