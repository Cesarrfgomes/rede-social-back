"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    nome: String,
    email: String,
    username: String,
    photo: String,
    description: String,
    isActive: Boolean,
    isVerified: Boolean,
    createdAt: Date
});
exports.default = (0, mongoose_1.model)('User', User);
