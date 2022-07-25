import express from "express";
import { PrismaClient } from '@prisma/client';


const app: express.Express = express();
//const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(cors({
//     origin: 'http://127.0.0.1:3001',
//     credentials: true,
//     optionsSuccessStatus: 200
// }))

const prisma = new PrismaClient();

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}
app.listen(port, () => {
    console.log(`Start on port 3000.`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

//一覧取得
app.get('/rendagame', async (req, res) => {
    const scores = await prisma.score_ranking.findMany();
    return res.json(scores);
});

//新規作成
app.post('/rendagame', async (req, res) => {
    const {score, user_id} = req.body;
    const result = await prisma.score_ranking.create({
        data: {
            score,
            user_id,
        },
    });
    return res.json(result);
} );