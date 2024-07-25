"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Post = new mongoose_1.Schema({
    user_id: mongoose_1.Types.ObjectId,
    description: String,
    images: [String],
    likes: [mongoose_1.Types.ObjectId],
    comments: [{
            _id: mongoose_1.Types.ObjectId,
            user_id: mongoose_1.Types.ObjectId,
            description: String
        }]
});
exports.default = (0, mongoose_1.model)('Post', Post);
