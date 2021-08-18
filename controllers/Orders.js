const { validationResult, header } = require('express-validator')
const moment = require('moment')
const productModel = require('../models/products')
const userModel = require('../models/users')
const conditionModel = require('../models/conditions')
const orderModel = require('../models/orders')
const orderLineModel = require('../models/order_line')


class OrderController {
    static async getAll(req, res) {
        try {
            const orders = await orderModel.findAll({
                include: [
                    {
                        model:userModel,
                        as:'user',
                        include:['roles'],
                        attributes: {
                            exclude: ['password','role_id']
                        }
                    },
                    {
                        model:conditionModel,
                        as:'condition',
                        attributes: ['name']
                    },
                    {
                        model:orderLineModel,
                        as:'order_line',
                        include:[
                            {
                                model:productModel,
                                as:'product',
                                attributes: ['name','price','image']
                            }
                        ],
                        attributes: {
                            exclude: ['product_id','order_id']
                        }
                    }
                    
                ],attributes: {
                    exclude: ['condition_id','user_id']
                }
            });
            return res.json({
                status: 200,
                data: orders
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error
            });
        }
    }



    //a function to create a new order with a product
    static async create(req, res) {
        try {
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(400).json({
                    status: 400,
                    error: error.array()
                });
            }
            // const { user_id } = req.user;

            const { products } = req.body;
            const { id } = req.user;
            let total = 0;

            // check if each element is a product in de data base
            products.forEach(async value => {
                let productFound = await productModel.findByPk(value.id)
                if(!productFound){
                    return res.status(400).json({
                        status: 400,
                        error: "product with id " + value + " does not exist"
                    })                   
                };
                total += productFound.price * value.quantity;
            });
            const condition = await conditionModel.findOne({
                where: {
                    name: 'Orden abierta'
                }
            });
            let orderCreated = await orderModel.findOne({
                where: {
                    user_id: id,
                    condition_id: condition.id
                }
            });
            if(!orderCreated){               
                orderCreated = await orderModel.create({
                    condition_id: condition.id,
                    user_id: id,
                    order_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                });
            }

            // const order_id = order.id;
            products.forEach(async product => {
                await orderLineModel.create({
                    product_id: product.id,
                    order_id: orderCreated.id,
                    quantity: product.quantity
                });
            });
            total += orderCreated.total

            orderCreated.total = total;
            await orderCreated.save();
            // const orderProduct = await orderLineModel.bulkCreate(products);

            return res.status(201).json({
                status: 201,
                message: "order created or products add to order created",
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    }
}


module.exports = OrderController