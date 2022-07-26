import express from "express";
import { PrismaClient } from '@prisma/client';
import crypto from "crypto";

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
if (port == null || port == undefined){
    port = 3000;
}
app.listen(port, () => {
    console.log(`Start on port 3000.`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//一覧取得
app.get('/rendagame', async (req, res) => {
    //アクセストークン確認
    const accessToken = req.header('access-token');

    //トークンなし検出
    if (accessToken == undefined){
        res.json({login_status: "access token is invalid"});
        return null;
    }

    const userId = await prisma.users.findFirst({
        where:{
            access_token: accessToken,
        }
    }).then(function(rows){
        console.log(rows);
        if (rows != null){
            return rows.ID;
        }
        else {
            res.json({login_status: "access token is invalid"});
            return null;
        }
    });

    if (userId == null){
        return;
    }

    //スコア取得(降順)
    const scores = await prisma.score_ranking.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            score: "desc",
        },
    });

    if (scores.length <= 0){
        return res.json({});
    }

    //名前取得
    const name = await prisma.users.findFirst({
        where: {
            ID: userId,
        },
    }).then(function(rows){
        if (rows != null){
            return rows.name;
        }
        else {
            res.json({});
            return null;
        }
    });

    if (name == null || name == undefined){
        return;
    }

    //結合して出力
    const count = scores.length;

    var array = [];
    for (var i = 0; i < count; i++){
        var json = {"name": name, "score": scores[i].score};
        array.push(json);
    }

    return res.json(array);
});

//新規作成
app.post('/rendagame', async (req, res) => {
    const score = req.body.score;
    //アクセストークン確認
    const accessToken = req.header('access-token');
    
    //トークンなし検出
    if (accessToken == undefined){
        res.json({login_status: "access token is invalid"});
        return null;
    }
        
    const userId = await prisma.users.findFirst({
        where:{
            access_token: accessToken,
        }
    }).then(function(rows){
        if (rows != null){
            return rows.ID;
        }
        else {
            res.json({login_status: "access token is invalid"});
            return null;
        }
    });

    if (userId == null){
        return;
    }
    
    const result = await prisma.score_ranking.create({
        data: {
            score: score,
            user_id: userId,
        },
    });
    return res.json(result);
} );

//新規ユーザー登録
app.post("/users/new", async (req, res) => {
    const name = req.body.name;
    const salt = await crypto.randomBytes(8).toString('hex');
    const password = await crypto.createHash('sha256').update(req.body.password + salt + process.env.PEPPER, 'utf8').digest('hex');

    const result = await prisma.users.create({
        data: {
            name,
            password,
            salt,
        },
    });
    return res.json(result);
});

//ログイン (ユーザー名とパスワードからトークン発行)
app.post("/users/login", async (req, res) => {
    const name = req.body.name;
    const passwordBuff = req.body.password;
    const salt = await prisma.users.findFirst({
        where: {
            name : name,
        },
    }).then(function(rows){
        if (rows != null){
            const salt = rows.salt;
            return salt;    
        }
        else{
            res.json({login_status: "No User found."});
            return null;
        }
    });

    if (salt == null){
        return;
    }

    const password = await crypto.createHash('sha256').update(passwordBuff + salt + process.env.PEPPER, 'utf8').digest('hex');
    const id = await prisma.users.findFirst({
        where: {
            AND: {
                name : name,
                password: password,
            }
        },
    }).then(function(rows){
        if (rows != null){
            const ID = rows.ID;
            return ID;    
        }
        else{
            res.json({login_status : 0});
            return null;
        }
    });

    if (id == null){
        return;
    }

    const tokenBuff = await crypto.randomBytes(8).toString('hex');
    const token = await Buffer.from(tokenBuff).toString('base64');
    const timeBuff = new Date();
    const expired_at = new Date(timeBuff.getFullYear(),
                                timeBuff.getMonth(),
                                timeBuff.getDate(),
                                timeBuff.getHours() + 1 + 9,
                                timeBuff.getMinutes());
    
    const result = await prisma.users.update({
        where:{
            ID: id,
        },
        data:{
            access_token: token,
        }
    }).then(function(){
        res.json({login_status : 1 , accessToken: token});
    });
});