import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { urlencoded, json } from 'body-parser';
import routers from './routers/index.route';
import dotenv from 'dotenv'
import db from './db/init';

dotenv.config()

const app = express();
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

//routers

//BodyParser Middleware
app.use(express.json());
//ActiverCORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers', "*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(morgan('combined', { stream: accessLogStream }));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use('/api', routers);
app.get('/api/users', async(req,res)=>{
    let snapshot = await db.collection("users").get();
    const list = snapshot.docs.map((doc)=>({id: doc.id , ...doc.data()}));
    res.send(list)

})
export default app;