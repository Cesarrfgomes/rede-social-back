import { Schema, model, Types } from "mongoose"

const Post = new Schema({
    user_id: Types.ObjectId,
    description: String,
    images: [String],
    likes: [Types.ObjectId],
    comments: [{
        _id: Types.ObjectId,
        user_id: Types.ObjectId,
        description: String
    }]
})

export default model('Post', Post)