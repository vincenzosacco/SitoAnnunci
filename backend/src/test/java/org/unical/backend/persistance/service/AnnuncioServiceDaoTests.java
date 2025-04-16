package org.unical.backend.persistance.service;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.unical.backend.model.Annuncio;

import java.util.Collection;
import java.util.List;

@SpringBootTest
@ActiveProfiles("test")
public class AnnuncioServiceDaoTests implements IAnnuncioServiceTests{



    @Override
    public Collection<Annuncio> testFindAll() {
        return List.of();
    }

    @Override
    public Annuncio testCreateAnnuncio(Annuncio ann) throws Exception {
        return null;
    }

    @Override
    public Annuncio testUpdateAnnuncio(int toUpdateAnnID, Annuncio ann) throws Exception {
        return null;
    }

    @Override
    public void testDeleteAnnuncio(int id) {

    }
}
