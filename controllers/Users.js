const jwt = require('jsonwebtoken');

const userModel = require('../models/users');

class User {
    static async getAll(req, res){
        try {
            const users = await userModel.findAll({
                attributes:{
                    exclude: ["role_id"]
                },
                include: ['roles']
            });
            return res.json({
                status: 200,
                data: users
            });
        } catch (err) {
            return res.status(500).json({
                status: 500,
                error: err
            });
        }
    }
    static async create(req, res) {
        try {
            const { user_name, name, surname, email, password, phone_number, direction, role_id } = req.body;
            if (!user_name|| !name|| !surname||!email || !password || !phone_number || !direction) {
                return res.status(422).json({
                    status: 422,
                    error: 'The input \"user_name\", \"name\", \"surname\", \"email\", \"password\", \"phone_number\" and \"direction\" are required'
                });
            }
            const userCreated = await userModel.create(
                {user_name, name, surname, email, password, phone_number, direction, role_id},
                { fields: ["user_name", "name", "surname", "email", "password", "phone_number", "direction", "role_id"] }
            );
            return res.status(201).json({
                status: 201,
                message: 'user created'
            }) 

        } catch (err) {
            return res.status(500).json({
                status: 500,
                error: err
            })
        }
    }
    static async update(req, res){
        try {
            const { user_name, name, surname, email, password, phone_number, direction, role_id } = req.body;
            const userId = await userModel.findOne({
                where: {
                    id: req.params.id
                }
            });
            const update = await userId.update(
                {user_name, name, surname, email, password, phone_number, direction, role_id},
                {fields: ["user_name", "name", "surname", "email", "password", "phone_number", "direction", "role_id"]}
            )
            return res.status(201).json({
                status: 201,
                message: 'Updated user'
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
            const deleteU = await userModel.destroy({
                where:{
                    id: req.params.id
                }            
            });
            return res.status(201).json({
                status: 201,
                message: 'Deleted user'
            })
        }catch{
            return res.status(500).json({
                status: 500,
                error
            })   
        }
    }
    static async login(req, res) {
        const user = await userModel.findOne({
            where: {
                email: req.body.email,
                password: req.body.password,
            },
            include:['roles']
        })
        if (!user) {
            return res.status(401).json({
                status: 401,
                error: "incorrect username and / or password"
            });
        }
        const token= jwt.sign({
            user:{
                id:user.id,
                email:user.email,
                rol: user.roles.name
            }
        },process.env.JWT_SECRET);
        return res.json({
            token,
            rol: user.roles.name
        });
    }
}

module.exports = User