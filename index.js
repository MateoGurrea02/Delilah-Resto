const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
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
const config = require('./config/index');
const { validatorCreateOrder } = require('./controllers/validators/orders');
const auth = require('./middlewares/authenticationUser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Docs
if (config.env === 'development') {
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    app.use(require('morgan')('dev'))
    const swaggerDocument = YAML.load('./docs/swagger.yaml');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//CRUD PRODUCTS
app.get('/product', isUser, ProductsController.getAll);
app.post('/product',isAdmin,ProductsController.create);
app.patch('/product/:id',isAdmin,existProduct , ProductsController.update);
app.delete('/product/:id',isAdmin, existProduct, ProductsController.delete);
app.get('/product/:id', isUser, existProduct, ProductsController.getProductById);

//CRUD USERS
app.get('/user', isAdmin,UserController.getAll);
app.post('/user',UserController.create);
app.patch('/user/:id', existUser, isAdmin, UserController.update);
app.delete('/user/:id', existUser, isAdmin, UserController.delete);
app.get('/user/:id', isAdmin, UserController.getOne);

//Login
app.post('/user/login', UserController.login);

//Orders
app.get('/order', isUser,OrderController.getAll)
app.post('/order', auth,validatorCreateOrder, isUser,OrderController.create)





const port = config.port;
app.listen(port, () => {
    console.log(`Server started on port=${port}`);
});