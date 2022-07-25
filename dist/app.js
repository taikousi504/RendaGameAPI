"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
//const cors = require('cors');
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(cors({
//     origin: 'http://127.0.0.1:3001',
//     credentials: true,
//     optionsSuccessStatus: 200
// }))
const prisma = new client_1.PrismaClient();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
    console.log(`Start on port 3000.`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
//一覧取得
app.get('/rendagame', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scores = yield prisma.score_ranking.findMany();
    return res.json(scores);
}));
//新規作成
app.post('/rendagame', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { score, user_id } = req.body;
    const result = yield prisma.score_ranking.create({
        data: {
            score,
            user_id,
        },
    });
    return res.json(result);
}));
