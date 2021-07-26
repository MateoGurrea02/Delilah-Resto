const { DataTypes } = require('sequelize');

const connection = require('../connection');
const conditionModel = require('./conditions')
const userModel = require('./users')


const model = connection.define(
    'order',
    {
        condition_id: {
            type: DataTypes.INTEGER
        },
        user_id:{
            type: DataTypes.INTEGER
        },
        order_date:{
            type: DataTypes.DATE
        }
    },{timestamps: false}
);


model.belongsTo(conditionModel, {as: 'condition', foreignKey: 'condition_id'});
model.belongsTo(userModel, {as: 'user', foreignKey: 'user_id'});


module.exports = model;