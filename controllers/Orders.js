const { validationResult, header } = require('express-validator')
const moment = require('moment')
const productModel = require('../models/products')
const userModel = require('../models/users')
const conditionModel = require('../models/conditions')
const orderModel = require('../models/orders')
const orderLineModel = require('../models/order_line')
const { Op } = require('sequelize')


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
    //a function to get one order by id
    static async getOne(req, res) {
        try {
            const order = await orderModel.findOne({
                where: {
                    id: req.params.id
                },
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
                ],
                attributes: {
                    exclude: ['condition_id','user_id']
                }
            });
            if (!order) {
                return res.status(400).json({
                    status: 400,
                    error: 'Order not found'
                });
            }
            return res.json({
                status: 200,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
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
            

            const { products } = req.body;
            const { id } = req.user;
            let total = 0;
            let promisesProducts = products.map(product => productModel.findByPk(product.id));
            let productsFound = await Promise.all(promisesProducts);
            // check if each element is a product in de data base
            productsFound.forEach((value,index) => {
                if(!value){
                    return res.status(400).json({
                        status: 400,
                        error: "product does not exist"
                    })                   
                };
                total += value.price * products[index].quantity;
            });
            const condition = await conditionModel.findOne({
                where: {
                    name: 'Orden abierta'
                }
            });
            let orderCreated = await orderModel.findOne({
                where: {
                    user_id: id,
                    condition_id: condition.id,
                    order_date:{ 
                        [Op.gte]:moment().subtract(30, 'minutes').toDate()
                    }
                }
            });
            if(!orderCreated){
                orderCreated = await orderModel.create({
                    condition_id: condition.id,
                    user_id: id,
                    total: 0,
                    order_date: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            }
            
            
            
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
    // a function to update a order condition
    static async update(req, res) {
        try {
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(400).json({
                    status: 400,
                    error: error.array()
                });
            }
            const { id } = req.params;
            const { condition_id } = req.body;
            const orderFound = await orderModel.findByPk(id);
            if(!orderFound){
                return res.status(400).json({
                    status: 400,
                    error: "order with id " + id + " does not exist"
                })                   
            };
            orderFound.condition_id = condition_id;
            await orderFound.save();
            return res.status(200).json({
                status: 200,
                message: "order condition updated",
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            });
        }
    }
    // a function to delete a order
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const orderFound = await orderModel.findByPk(id);
            const orderLineFound = await orderLineModel.findAll({
                where: {
                    order_id: id
                }
            });
            if(!orderFound){
                return res.status(400).json({
                    status: 400,
                    error: "order with id " + id + " does not exist"
                })                   
            };

            for(let i = 0; i < orderLineFound.length; i++){
                await orderLineFound[i].destroy();
            }
            orderFound.destroy();
            
            
            return res.status(200).json({
                status: 200,
                message: "order deleted",
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