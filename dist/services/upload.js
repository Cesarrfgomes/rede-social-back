"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const endpoint = new aws_sdk_1.default.Endpoint(process.env.ENDPOINT_S3);
const s3 = new aws_sdk_1.default.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
});
const uploadFile = async (path, buffer, mimetype) => {
    const file = await s3.upload({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    }).promise();
    return file.Location;
};
exports.uploadFile = uploadFile;
