"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const Users_1 = __importDefault(require("../models/Users"));
class UserController {
    async create(req, res) {
        const { name, email, username, photo, description } = req.body;
        try {
            const existUsernameOrUserEmail = await Users_1.default.findOne({
                $or: [{ email }, { username }]
            });
            if (existUsernameOrUserEmail) {
                return res.status(400).json({ message: "Username ou e-mail já existe!" });
            }
            const newUser = await Users_1.default.create({
                name,
                email,
                username,
                photo,
                description,
                isActive: true,
                isVerified: false,
                createdAt: new Date
            });
            return res.status(201).json(newUser);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    async get(req, res) {
        try {
            const users = await Users_1.default.find();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    async show(req, res) {
        const { id } = req.params;
        try {
            const user = await Users_1.default.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    async update(req, res) {
        const { name, email, username, photo, description } = req.body;
        const { id } = req.params;
        try {
            const user = await Users_1.default.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            const existUsernameOrUserEmail = await Users_1.default.findOne({
                $or: [{ email, _id: { $ne: id } }, { username, _id: { $ne: id } }]
            });
            if (existUsernameOrUserEmail) {
                res.json({ message: "Username ou e-mail já existe!" });
            }
            await Users_1.default.updateOne({ _id: id }, {
                name,
                email,
                username,
                photo,
                description
            });
            return res.status(204).json();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
    async inactive(req, res) {
        const { id } = req.params;
        try {
            const user = await Users_1.default.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            if (user.isActive === false) {
                await Users_1.default.updateOne({ _id: id }, {
                    isActive: true
                });
            }
            else {
                await Users_1.default.updateOne({ _id: id }, {
                    isActive: false
                });
            }
            return res.status(204).json();
        }
        catch (error) {
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }
}
exports.UserController = UserController;
