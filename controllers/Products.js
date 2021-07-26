const productModel = require('../models/products')
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
    static async getProductById(req, res){
        try {
            const product = await productModel.findOne({
                where: {
                    id: req.params.id
                }
            });
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
    
    static async update(req, res){
        try {
            const { name, price, image } = req.body;
            const productId = await productModel.findOne({
                where: {
                    id: req.params.id
                }
            });
            const update = await productId.update(
                {name,price,image},
                {fields:["name", "price", "image"]}
            )
            return res.status(201).json({
                status: 201,
                message: 'Updated product'
            }) 
        }catch{
            return res.status(500).json({
                status: 500,
                error
            })   
        }
    }
    static async delete(req, res){
        try {   
            const deleteP = await productModel.destroy({
                where:{
                    id: req.params.id
                }            
            });
            return res.status(201).json({
                status: 201,
                message: 'Deleted product'
            })
        }catch{
            return res.status(500).json({
                status: 500,
                error
            })   
        }
    }
}

module.exports = Products