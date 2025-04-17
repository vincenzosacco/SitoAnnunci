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

    /**
     * Save the entity.
     * @param ann The entity to save.
     * @throws Exception if the entity cannot be saved.
     * @return The saved entity.
     */
    public ENT save(ENT ann) throws Exception;

    /**
     * Delete the entity.
     * @param ann The entity to delete.
     * @throws Exception if the entity cannot be deleted.
     */
    public void delete(ENT ann) throws Exception;
}
