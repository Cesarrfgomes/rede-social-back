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

    async get(req:Request, res: Response){
        try {
            const posts = await Post.find()

            return res.status(200).json(posts)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }

    async show(req:Request, res: Response){
        const {id} = req.params
        try {
            const post = await Post.findById(id)

            if(!post){
                return res.status(404).json({message: "Postagem não encontrada!"})
            }

            return res.status(200).json(post)
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }

    async update(req:Request, res: Response){
        const {id} = req.params
        const {description} = req.body

        try {
            const post = await Post.findById(id)

            if(!post){
                return res.status(404).json({message: "Postagem não encontrada!"})
            }

            await Post.updateOne({_id: id}, {
                description
            })
            
            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }

    async delete(req:Request, res: Response){
        const {id} = req.params
        try {
            const post = await Post.findById(id)

            if(!post){
                return res.status(404).json({message: "Postagem não encontrada!"})
            }

            await Post.deleteOne({_id: id})

            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }

    async like(req: Request, res: Response){
        const {id} = req.params
        
        try {
            const post = await Post.findById(id)

            if(!post){
                return res.status(404).json({message: "Postagem não encontrada!"})
            }
            
            await Post.updateOne({_id: id}, {
                $inc: {
                    likes: 1
                }
            })

            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }

    async commentPost(req: Request, res: Response){
        const {id} = req.params
        const {description,} = req.body
        
        try {
            const post = await Post.findById(id)

            if(!post){
                return res.status(404).json({message: "Postagem não encontrada!"})
            }
            
            await Post.updateOne({_id: id}, {
                $push: {
                    comments: {
                        _id: new mongoose.Types.ObjectId(),
                        description
                    }
                }
            })

            return res.status(204).json()
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor!"})
        }
    }
}