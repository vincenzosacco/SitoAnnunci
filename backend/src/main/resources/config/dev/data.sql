-- data.sql - Used to populate the h2 (in-memory) database with some test data.
-- All objects will be deleted when the application is closed or restarted.
INSERT INTO annuncio (title, description, price)
VALUES ('First Annuncio',
     'This is the first annuncio',
    100.00);

INSERT INTO annuncio (title, description, price)
VALUES ('Second Annuncio',
    'This is the second annuncio',
     200.00);