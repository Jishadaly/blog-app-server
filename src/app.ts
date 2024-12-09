import express  from "express";
import authRouter from "./framework/Routes/authRoute";
import { connectToDb } from "./config/dbConfig";
const cors = require('cors');

const app  = express();
const port = 3000;

const corsOption = {
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
 };

 app.use(cors(corsOption));
app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/api',authRouter);

connectToDb();

app.listen(port,()=>{
    console.log(`app is running http://localhost:${port}`);
});