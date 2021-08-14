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
	name VARCHAR(255) not null
);
create table roles(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	name VARCHAR(255) not null
);
create table users(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	user_name VARCHAR(255) not null,
	name VARCHAR(255)not null,
	surname VARCHAR(255) not null,
	email VARCHAR(25) not null,
	password VARCHAR(255) not null,
	phone_number VARCHAR(255) not null,
	direction VARCHAR(255) not null,
	role_id INT default 2,
	foreign key (role_id) references roles(id)
);

create table orders(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
	condition_id INT not null,
	user_id INT not null,
	order_date DATE not null,
	total double,
	foreign key (condition_id) references conditions(id),
	foreign key (user_id) references users(id)
);
create table order_lines(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	order_id int not null,
	product_id int not null,
	quantity int,
	foreign key (order_id) references orders(id),
	foreign key (product_id) references products(id)
);

insert into roles values(null,'Admin');
insert into roles values(null,'User');
insert into conditions values(null,'Confirmado');
insert into conditions values(null,'En preparación');
insert into conditions values(null,'En camino');
insert into conditions values(null,'Entregado');
insert into users values(null,'example_user','Admin','example_admin','admin@gmail.com','123','12345678','direction 124',1);
insert into users values(null,'example_user','User','example_user','user@gmail.com','321','45695132','direction 484',2);
insert into products values(null, 'Bagel de salmon', 425, 'img1');
insert into products values(null, 'Hamburguesa Clasica', 350, 'img2');

