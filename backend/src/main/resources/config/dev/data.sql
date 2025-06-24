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
INSERT INTO utente (nome, email, "password", ruolo_id, bannato)
VALUES ('Admin User', 'admin@gmail.com', 'admin123', 1, false);
INSERT INTO utente (nome, email, "password", ruolo_id, bannato)
VALUES ('Buyer User', 'buyer@gmail.com', 'buyer123', 2, false);
INSERT INTO utente (nome, email, "password", ruolo_id, bannato)
VALUES ('Seller User', 'seller@gmail.com', 'seller123', 3, false);
-- ANNUNCIO DATA ----------

INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, metri_quadri, indirizzo, in_vendita, categoria_id,
                      venditore_id, foto, promozione)
VALUES ('First Annuncio',
     'This is the first annuncio',
    100000.55,     95000.00, 300, 'Via Roma 1, Milano', true, 1,
    1, NULL, false);
INSERT INTO annuncio (titolo, descrizione, prezzo, prezzo_asta, metri_quadri, indirizzo, in_vendita, categoria_id,
                      venditore_id, data_creazione, foto, promozione)
VALUES ('Second Annuncio',
     'This is the second annuncio',
    200000.00,     NULL, 150, 'Via Milano 2, Roma', true, 2,
    2, CURRENT_TIMESTAMP, NULL, true);
