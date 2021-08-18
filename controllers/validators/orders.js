const { body } = require('express-validator');

const validatorCreateOrder = [
    body("products").custom(values => {
        if(!Array.isArray(values)){
            return Promise.reject("products must be an array");
        }
        if(values.length === 0){
            return Promise.reject("products must not be empty");
        }
        //verificar que todos los productos tengan el campo id y quantity <= 0
        for(let i = 0; i < values.length; i++){
            if(!values[i].hasOwnProperty("id") || !values[i].hasOwnProperty("quantity")){
                return Promise.reject("products must have id and quantity");
            }
            if(values[i].quantity <= 0){
                return Promise.reject("quantity must be greater than 0");
            }
        }
        return Promise.resolve();
    }),
]

// deben ser los siguientes pasos:
//3)-- Verificar si el usuario tiene una orden creada q para el dia actual q el estado sea igual a recién creado y almacenar esa orden en una variable
//4)-- Si no existe la orden se crea una eso devuelve los datos de la orden(podes re usar la variable creada en el paso 3 para no crear una variable nueva)
//5)-- Si esta creada la orden la variable en la cual hiciste la consulta (en el paso 3 y 4) ahí tenes el id de la orden
//6)-- con ese id de la orden agregar los productos a la tabla intermedia
//7)-- devolver mensaje con status 201 informando q la orden se creo
//8)-- en caso de error devolver error

module.exports = { validatorCreateOrder };
