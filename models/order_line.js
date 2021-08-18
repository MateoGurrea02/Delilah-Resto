const { DataTypes } = require('sequelize');

const connection = require('../connection');
const orderModel = require('./orders')
const productModel = require('./products')

const model = connection.define(
    'order_line',
    {
        order_id: {
            type: DataTypes.INTEGER
        },
        product_id: {
            type: DataTypes.INTEGER
        },
        quantity: {
            type: DataTypes.INTEGER
        }
    },{timestamps: false}
);


model.belongsTo(productModel, {as: 'product', foreignKey: 'product_id'});

module.exports = model;