DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(333) NOT NULL,
    last VARCHAR(333) NOT NULL,
    email VARCHAR(333) NOT NULL UNIQUE,
    pass VARCHAR(333) NOT NULL,
    img VARCHAR(333),
    bio VARCHAR(333)
);
