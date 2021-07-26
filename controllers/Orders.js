const productModel = require('../models/products')
const userModel = require('../models/users')
const conditionModel = require('../models/conditions')
const orderModel = require('../models/orders')

class OrderController {
    static async getAll(req, res) {
        try {
            const order = await orderModel.findAll();
            return res.json({
                status: 200,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error
            });
        }
    }
    //a function to create a new order
    static async create(req, res) {
        try {
            const { condition_id, user_id, order_date } = req.body
            if(!condition_id || !user_id || !order_date){
                return res.status(400).json({
                    status: 400,
                    error: 'The input \"condition_id\", \"user_id\", \"order_date\" are required'
                });
            }
            const orderCreated = await orderModel.create(
                {condition_id, user_id, order_date},
                {fields: [ 'condition_id','user_id','order_date'] }
            );
            return res.json({
                status: 200,
                message: 'Oreder Created successful' 
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error
            });
        }
    }
}


module.exports = OrderController