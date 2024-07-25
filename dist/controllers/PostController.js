"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const Posts_1 = __importDefault(require("../models/Posts"));
const Users_1 = __importDefault(require("../models/Users"));
const mongoose_1 = require("mongoose");
const upload_1 = require("../services/upload");
class PostController {
    async create(req, res) {
        const { user_id, description } = req.body;
        try {
            const user = await Users_1.default.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            const files = req.files;
            const images = await Promise.all(files.map(async (file) => {
                const img = await (0, upload_1.uploadFile)(`postagens/${file.originalname}`, file.buffer, file.mimetype);
                return img;
            }));
            const newPost = await Posts_1.default.create({
                user_id: user._id,
                description,
                images,
                likes: [],
                comments: []
            });
            return res.status(201).json(newPost);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async get(req, res) {
        try {
            const posts = await Posts_1.default.aggregate([
                {
                    $unwind: {
                        path: '$comments',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'comments.user_id',
                        foreignField: '_id',
                        as: 'comments.user'
                    }
                },
                {
                    $unwind: {
                        path: '$comments.user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        comments: {
                            $push: '$comments'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'postDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$postDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'postDetails.comments': '$comments'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$postDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $addFields: {
                        user: { $first: '$user' }
                    }
                },
                {
                    $addFields: {
                        likes: {
                            $cond: {
                                if: { $isArray: '$likes' },
                                then: { $size: '$likes' },
                                else: 0
                            }
                        }
                    }
                }
            ]);
            return res.status(200).json(posts);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async show(req, res) {
        const { id } = req.params;
        try {
            const post = await Posts_1.default.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Postagem não encontrada!" });
            }
            return res.status(200).json(post);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async update(req, res) {
        const { id } = req.params;
        const { description } = req.body;
        try {
            const post = await Posts_1.default.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Postagem não encontrada!" });
            }
            await Posts_1.default.updateOne({ _id: id }, {
                description
            });
            return res.status(204).json();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            const post = await Posts_1.default.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Postagem não encontrada!" });
            }
            await Posts_1.default.deleteOne({ _id: id });
            return res.status(204).json();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async like(req, res) {
        const { id } = req.params;
        const { user_id } = req.body;
        try {
            const post = await Posts_1.default.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Postagem não encontrada." });
            }
            const user = await Users_1.default.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            const likeExists = post.likes.find(like => String(like) === user_id);
            if (likeExists) {
                await Posts_1.default.updateOne({ _id: id }, {
                    $pull: {
                        likes: new mongoose_1.Types.ObjectId(user_id)
                    }
                });
                return res.status(204).json();
            }
            await Posts_1.default.updateOne({ _id: id }, {
                $push: {
                    likes: new mongoose_1.Types.ObjectId(user_id)
                }
            });
            return res.status(204).json();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
    async commentPost(req, res) {
        const { id } = req.params;
        const { description, user_id } = req.body;
        try {
            const post = await Posts_1.default.findById(id);
            if (!post) {
                return res.status(404).json({ message: "Postagem não encontrada!" });
            }
            const user = await Users_1.default.findById(user_id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            await Posts_1.default.updateOne({ _id: id }, {
                $push: {
                    comments: {
                        _id: new mongoose_1.Types.ObjectId(),
                        user_id: new mongoose_1.Types.ObjectId(user_id),
                        description
                    }
                }
            });
            return res.status(204).json();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor!" });
        }
    }
}
exports.PostController = PostController;
