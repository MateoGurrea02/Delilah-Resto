const { DataTypes } = require('sequelize');

const connection = require('../connection');

const model = connection.define(
    'product',
    {
        name: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        image:{
            type: DataTypes.STRING
        }
    }, {timestamps: false}
);

module.exports = model;