import express  from "express";
import authRouter from "./framework/Routes/authRoute";
import { connectToDb } from "./config/dbConfig";
const cors = require('cors');
import { Request , Response ,NextFunction } from "express";
const app  = express();
const port = 3000;
import http from "http";

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

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        success: false,
        message: error.message
    });
});
app.on('request' , ()=>{
    console.log('requst got');
    
})

const server = http.createServer(app)
server.on('request',(req:Request , res:Response)=>{
    console.log('Requst recived : ',req.method , req.url);
    
})

server.listen(port,()=>{
    console.log(`app is running http://localhost:${port}`);
});