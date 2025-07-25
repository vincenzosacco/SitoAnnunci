-- data.sql - Used to populate the h2 (in-memory) database with some test data.
-- All objects will be deleted when the application is closed or restarted.

-- RUOLO DATA ----------
INSERT INTO ruolo (tipo) VALUES ('ADMIN');
INSERT INTO ruolo (tipo) VALUES ('BUYER');
INSERT INTO ruolo (tipo) VALUES ('SELLER');

-- CATEGORIA IMMOBILE DATA ----------
INSERT INTO categoria_immobile (tipo) VALUES ('Appartamento');
INSERT INTO categoria_immobile (tipo) VALUES ('Villa');
INSERT INTO categoria_immobile (tipo) VALUES ('Ufficio');
-- UTENTE DATA ----------
INSERT INTO utente (nome, cellulare, email, "password", ruolo_id, bannato)
VALUES ('Admin User', 1111111111,'admin@gmail.com', 'admin123', 1, false);
INSERT INTO utente (nome, cellulare, email, "password", ruolo_id, bannato)
VALUES ('Buyer User', 2222222222, 'buyer@gmail.com', 'buyer123', 2, false);
INSERT INTO utente (nome, cellulare, email, "password", ruolo_id, bannato)
VALUES ('Seller User', 3333333333, 'seller@gmail.com', 'seller123', 3, false);
INSERT INTO utente (nome, cellulare, email, "password", ruolo_id, bannato)
VALUES ('Seller2 User', 4444444444,'seller2@gmail.com', 'seller2123', 3, false);
-- ANNUNCIO DATA ----------

INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, superficie, indirizzo, latitudine, longitudine, in_vendita, categoria_id,
                      venditore_id, foto, promozione)
VALUES ('First Annuncio',
     'This is the first annuncio',
    100000.55,     95000.00, 300, 'Via Roma 1, Milano', 45.52007, 9.00447, true, 1,
    3, 'https://picsum.photos/200', false);

INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, superficie, indirizzo, latitudine, longitudine, in_vendita, categoria_id,
                      venditore_id, data_creazione, foto, promozione)
VALUES ('Second Annuncio',
     'This is the second annuncio',
    200000.00,     NULL, 150, 'Via Milano 2, Roma', 41.89948, 12.48965, true, 2,
    3, CURRENT_TIMESTAMP, 'https://picsum.photos/201', true);

INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, superficie, indirizzo, latitudine, longitudine, in_vendita, categoria_id,
                      venditore_id, foto, promozione)
VALUES ('Third Annuncio',
        'This is the third annuncio',
        1000.55,     5000.00, 130, 'Via Roma 5, Bergamo', 45.67755, 9.60839, false, 1,
        4, 'https://picsum.photos/202', false);


-- CONVERSAZIONI DATA
INSERT INTO conversazione(utente1_id, utente2_id)
VALUES (2,3);


INSERT INTO conversazione(utente1_id, utente2_id)
VALUES (2,4);


-- MESSAGGI DATA ----------

-- UTENTI 2-3
INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (2, 3, 'Salve il suo annuncio è ancora valido?', CURRENT_TIMESTAMP, 1);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (3, 2, 'Ciao! Sei interessato all’annuncio?', CURRENT_TIMESTAMP, 1);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (2, 3, 'Sì, volevo avere qualche dettaglio in più.', CURRENT_TIMESTAMP, 1);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (3, 2, 'Certo, chiedi pure!', CURRENT_TIMESTAMP, 1);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (2, 3, 'Quanti metri quadri ha l’appartamento?', CURRENT_TIMESTAMP, 1);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (3, 2, 'Circa 100, ed è stato ristrutturato di recente.', CURRENT_TIMESTAMP, 1);


-- UTENTI 2-4

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (2, 4, 'Salve il suo annuncio è ancora valido?', CURRENT_TIMESTAMP, 2);

INSERT INTO messaggio(mittente_id, destinatario_id, testo, data, conversazione_id)
VALUES (4, 2, 'No, mi dispiace.', CURRENT_TIMESTAMP, 2);


-- RECENSIONI DATA

INSERT INTO recensione(annuncio_id, autore_id, nome_autore, testo, voto, data)
VALUES (1,2, 'Buyer User', 'Molto bello', 5, CURRENT_TIMESTAMP);

INSERT INTO recensione(annuncio_id, autore_id, nome_autore, testo, voto, data)
VALUES (2,2, 'Buyer User', 'Carino', 4, CURRENT_TIMESTAMP);
