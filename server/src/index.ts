import express, { Request, Response } from "express"
const app = express();
const PORT = 3000;
app.get("/",(req:Request,res:Response)=>{
    res.json("Abebe tests server now ")
})
app.listen(PORT,()=>{
    console.log(`app is runnig On ${PORT}`)
})