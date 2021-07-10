const productModel = require('../models/products')
const userModel = require('../models/users')
class Products{
    static async getAll(req, res){
        try {
            const product = await productModel.findAll();
            return res.json({
                status: 200,
                data: product
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error
            });
        }
    }
    static async create(req, res){
        try {
            const { name, price, image } = req.body;
            if(!name || !price || !image){
                return res.status(422).json({
                    status:422,
                    error:'The input \"name\", \"price\", \"image\" are required'
                })
            }
            const productCreated = await productModel.create(
                { name, price, image},
                { fields: ["name", "price", "image"] }
            );
            return res.status(201).json({
                status: 201,
                message: 'product created'
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error
            });
        }
    }
}

module.exports = Products