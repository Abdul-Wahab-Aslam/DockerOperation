-- init.sql
-- Automatically runs once when the MySQL container is created for the first time.

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, quantity) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 15.99, 50),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 45.50, 30),
('HD Webcam', '1080p webcam with built-in microphone', 25.00, 40),
('Bluetooth Headphones', 'Over-ear noise cancelling headphones', 60.75, 20),
('Laptop Stand', 'Adjustable aluminum laptop stand', 22.30, 35);
