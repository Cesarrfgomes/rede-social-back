import {Request, Response} from 'express'
import User from '../models/Users'

export class UserController{
    async create(req: Request, res: Response){
        const {name, email, username, photo, description} = req.body

        try {

            const existUsernameOrUserEmail = await User.findOne({
                $or:  [{email}, {username}]
            })
            
            if(existUsernameOrUserEmail){
                res.json({message: "Username ou e-mail já existe!"})
            }
            

            const newUser = await User.create({
                name,
                email,
                username,
                photo,
                description,
                isActive: true,
                isVerified: false,
                createdAt: new Date
            })

            return res.status(201).json(newUser)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor"})
        }
    }

    async get(req: Request, res: Response){
        try {
            const users = await User.find()

            return res.json(users)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor"})
        }
    }

    async show(req: Request, res: Response){
        const {id} = req.params

        try {
            const user = await User.findById(id)

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            return res.json(user)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor"})
        }
    }

    async update(req: Request, res: Response){
        const {name, email, username, photo, description} = req.body
        const {id} =  req.params

        try {
            const user = await User.findById(id)

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            const existUsernameOrUserEmail = await User.findOne({
                $or:  [{email, _id: {$ne: id}}, {username, _id: {$ne: id}}]
            })
            
            if(existUsernameOrUserEmail){
                res.json({message: "Username ou e-mail já existe!"})
            }
            

            await User.updateOne({_id: id},{
                name,
                email,
                username,
                photo,
                description
            })

            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor"})
        }
    }

    async inactive(req: Request, res: Response) {
        const {id} = req.params
        try {
            const user = await User.findById(id)

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            if(user.isActive === false){
                await User.updateOne({_id: id}, {
                    isActive: true
                })
            }else{
                await User.updateOne({_id: id},{
                    isActive: false
                })
            }

            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor"})
        }
    }
}