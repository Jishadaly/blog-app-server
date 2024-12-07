import express  from "express";
import authRouter from "./framework/Routes/authRoute";
import { connectToDb } from "./config/dbConfig";
const app  = express();
const port = 3001;


app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.use('/api/',authRouter);

connectToDb();

app.listen(port,()=>{
    console.log(`app is running http://localhost:${port}`);
});