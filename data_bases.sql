create database delilharesto

use delilharesto


create table products(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	name VARCHAR(255) not null,
	price double not null,
	image varchar(255)
);
create table conditions(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	nombre VARCHAR(255) not null
);
create table roles(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	nombre VARCHAR(255) not null
);
create table orders(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	condition_id INT not null,
	user_id INT not null,
	oreder_date DATE not null
);
create table users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	users_name VARCHAR(255) not null,
	name VARCHAR(255)not null,
	surname VARCHAR(255) not null,
	email VARCHAR(25) not null,
	password VARCHAR(255) not null,
	phone_number VARCHAR(255) not null,
	direction VARCHAR(255) not null,
	role_id INT not null,
	foreign key (role_id) references roles(id)
);

create table order_line(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	order_id int not null,
	product_id int not null,
	total double not null,
	foreign key (order_id) references orders(id),
	foreign key (product_id) references products(id)
);
