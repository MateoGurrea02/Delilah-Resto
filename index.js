require('dotenv').config();
const express = require('express');
const app = express();

const connection = require('./connection');
const UserController = require('./controllers/Users');
const ProductsController = require('./controllers/Products');
const OrderController = require('./controllers/Orders');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/products', ProductsController.getAll);
app.post('/products', ProductsController.create);
















const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started on port=${port}`);
});