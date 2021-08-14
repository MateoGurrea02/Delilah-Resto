const { validationResult } = require('express-validator')
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

            const { condition_id, user_id, order_date, quantity } = req.body;
            const { products } = req.body;

            // const order = await orderModel.create({
            //     condition_id,
            //     user_id,
            //     order_date,
            // });
            
            const order_id = order.id;
            products.forEach((product, array) => {
                // const { product_id, quantity, price, comments } = product;
                product.order_id = order_id;
            });
            const orderProduct = await orderLineModel.bulkCreate(products);

            return res.json({
                status: 200,
                data: {order_id: order.id}
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