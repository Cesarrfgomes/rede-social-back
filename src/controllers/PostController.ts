import {Request, Response} from 'express'
import Post from "../models/Posts"
import User from '../models/Users'
import mongoose from 'mongoose'

export class PostController{
    async create(req:Request, res:Response){
        const {user_id, description, images} = req.body

        try {
            const user = await User.findById(user_id)

            if(!user){
                return res.status(404).json({message: "Usuário não encontrado"})
            }

            const newPost = await Post.create({
                user_id: user._id,
                description,
                images,
                likes: 0,
                comments: []
            })

            return res.status(201).json(newPost)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }
}