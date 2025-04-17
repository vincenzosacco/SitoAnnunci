-- schema.sql - Used to create the init schema for h2(in memory) database.
-- All objects will be deleted when the application is closed or restarted.
CREATE TABLE annuncio (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- ID can be generated only by db
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2)
);