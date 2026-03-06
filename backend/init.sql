CREATE DATABASE IF NOT EXISTS drink_ordering_sys;

USE drink_ordering_sys;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0
);

-- Insert some dummy data
INSERT INTO products (name, price, stock_quantity) VALUES ('Cola', 1.50, 10);
INSERT INTO products (name, price, stock_quantity) VALUES ('Coffee', 2.00, 3);
INSERT INTO products (name, price, stock_quantity) VALUES ('Tea', 1.00, 20);
