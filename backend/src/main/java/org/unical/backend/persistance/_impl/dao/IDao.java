/*
DAO interface for T
 */

package org.unical.backend.persistance._impl.dao;
import java.util.Collection;

/**
 * DAO interface for all the entities
 * @param <ENT> Entity type
 * @param <PK> Primary key type
 */
public interface IDao<ENT, PK> {
    public Collection<ENT> findAll();

    public ENT findByPrimaryKey(PK id);

    public void save(ENT ann);

    public void delete(ENT ann);
}
