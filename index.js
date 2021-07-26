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
const isAdmin = require('./middlewares/isAdmin');
const isUser = require('./middlewares/isUser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CRUD PRODUCTS
app.get('/product', isUser, ProductsController.getAll);
app.post('/product',isAdmin,ProductsController.create);
app.patch('/product/:id',isAdmin,existProduct , ProductsController.update);
app.delete('/product/:id',isAdmin, existProduct, ProductsController.delete);
app.get('/product/:id', isUser, existProduct, ProductsController.getProductById);

//CRUD USERS
app.get('/user', isAdmin,UserController.getAll);
app.post('/user',UserController.create);
app.patch('/user/:id', existUser, UserController.update);
app.delete('/user/:id', existUser, UserController.delete);

//Login
app.post('/user/login', UserController.login);

//Orders
app.get('/order', isUser,OrderController.getAll)
app.post('/order', isUser,OrderController.create)





const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port=${port}`);
});