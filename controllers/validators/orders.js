const { body } = require('express-validator');
const productModel = require('../../models/products');
const validatorCreateOrder = [
    body("condition_id").isInt().withMessage("order_date must be an integer").notEmpty().withMessage("condition_id is missing"),
    body("order_date").isString().withMessage("order_date must be a string").notEmpty().withMessage("order_date is missing"),
    body("user_id").isInt().withMessage("user_id must be an integer").notEmpty().withMessage("user_id is missing"),
    body("quantity").custom(value => {
        if (value === undefined || value === null){
            return Promise.reject("quantity is missing");
        }
        if (typeof value !== "number") {
            return Promise.reject("quantity must be a number");
        }
        if (value <= 0) {
            return Promise.reject("quantity must be greater than or equal to 1");
        }
        return Promise.resolve();
    }),
    body("products").custom(values => {
        if(values.length === 0){
            return Promise.reject("products must not be empty");
        }
        if(!Array.isArray(values)){
            return Promise.reject("products must be an array");
        }
        if(values.length <= 0){
            return Promise.reject("products must be an array with at least one element");
        }
        //check if each element is an number
        if(!values.every(value => typeof value === "number")){  
            return Promise.reject("products must be an array of number")
        }
        // check if each element is a product in de data base
        return Promise.all(values.map(value => {
            return productModel.findByPk(value).then(product => {
                if(product === null){
                    return Promise.reject("product with id " + value + " does not exist");
                }
                return Promise.resolve();
            });
        }));
        // values.forEach(products => {
        //     if(!products.hasOwnProperty("product_id")){
        //         return Promise.reject("products must have a product_id");                
        //     }
        // });
        return Promise.resolve();
    })
]

module.exports = { validatorCreateOrder };
