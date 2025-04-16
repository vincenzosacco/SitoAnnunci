-- schema.sql
CREATE TABLE annuncio (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2)
);