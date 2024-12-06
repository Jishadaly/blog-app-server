import express  from "express";
const app  = express();
const port = 3000;

app.listen(port,()=>{
    console.log(`app is running http://localhost:${port}`);
});

app.use(express.urlencoded({extended:true}))

app.post( '/login',(req , res)=>{
    console.log(req.body);
    res.status(200).json({message:'success'});
})