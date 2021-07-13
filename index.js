require('dotenv').config();
const express = require('express');
const app = express();

const connection = require('./connection');
const UserController = require('./controllers/Users');
const ProductsController = require('./controllers/Products');
const OrderController = require('./controllers/Orders');
const productModel = require('./models/products');
const existProduct = require('./middlewares/existProducts');
const existUser = require('./middlewares/existUser');
const jwtMiddleware = require('./middlewares/verifyRol');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CRUD PRODUCTS
app.get('/product', ProductsController.getAll);
app.post('/product', jwtMiddleware,ProductsController.create);
app.patch('/product/:id', jwtMiddleware,existProduct , ProductsController.update);
app.delete('/product/:id', jwtMiddleware, existProduct, ProductsController.delete);

//CRUD USERS
app.get('/user', jwtMiddleware,UserController.getAll);
app.post('/user', UserController.create);
app.patch('/user/:id', existUser, UserController.update);
app.delete('/user/:id', existUser, UserController.delete);

//Login
app.post('/login', UserController.login);







const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port=${port}`);
});