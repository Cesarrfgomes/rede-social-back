"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dbUri = process.env.DB_URI;
mongoose_1.default.connect(dbUri).then(() => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(routes_1.default);
    app.listen(process.env.PORT, () => {
        console.log('Servidor iniciado.');
    });
}).catch((error) => {
    console.log(error);
});
