const { DataTypes } = require('sequelize');

const connection = require('../connection');
const rolModel = require('./role')

const model = connection.define(
    'user',
    {
        user_name: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        surname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        phone_number:{
            type: DataTypes.STRING
        },
        direction:{
            type: DataTypes.STRING
        },role_id:{
            type: DataTypes.INTEGER
        }
    },{timestamps: false}
);


model.belongsTo(rolModel, {as: 'roles', foreignKey: 'role_id'});

module.exports = model;