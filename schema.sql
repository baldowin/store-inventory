DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(75) NOT NULL,
    department_name VARCHAR(75) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name, price,stock_quantity)
VALUES ("Bananas","Produce",3.75,500),
("Baseballs","Sports",7.50,1000),
("Best Selling new book","Books",24.99,248),
("Bavengers","Movies",14.64,390),
("Batan","Board Games",37.89,243),
("Ball of Duty","Video Games",60,4032),
("Ballpoint pen","Office Supplies",7.37,800),
("Burka","Clothing",40.35,60),
("Bongo Drum","Music",34.23,3),
("Bourbon","Beverages",70,2);

UPDATE products SET price=1 WHERE item_id=6;
select * from products;