CREATE TABLE schools (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    CONSTRAINT unique_location UNIQUE (latitude, longitude)
);
