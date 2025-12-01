CREATE USER app_user WITH PASSWORD 'app_password';
CREATE DATABASE app_db OWNER app_user;
\connect app_db;
CREATE TABLE users(id SERIAL PRIMARY KEY,name VARCHAR(100),email VARCHAR(100));
CREATE TABLE items(id SERIAL PRIMARY KEY,name VARCHAR(100),price NUMERIC(10,2),user_id INT REFERENCES users(id));
INSERT INTO users(name,email) VALUES('Alice','alice@example.com'),('Bob','bob@example.com');
INSERT INTO items(name,price,user_id) VALUES('Milk Tea',60,1),('Fried Chicken',90,2),('Midnight Snack Set',150,1);