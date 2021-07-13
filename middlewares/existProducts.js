const productModel = require('../models/products')
async function existProduct(req, res, next) {
    const product = await productModel.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!product){
        return res.status(401).json({
            status: 401,
            error: 'Product not found'
        })
    }
    next()
}

module.exports = existProduct