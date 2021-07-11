const dotenv =require('dotenv');
dotenv.config();
require('./db/mongoose')

//////////////////////////////// yaat scheduling r kaam kribo lagbo ////////////

const express=require('express');
const profileRouter=require('./routers/profile');
const userRouter=require('./routers/user')
const oldProblemsRouter=require('./routers/oldProblems')


const app= express();

const PORT= process.env.PORT

app.use(express.json());

app.use(profileRouter);
app.use(userRouter)
app.use(oldProblemsRouter)






app.get('/',(req,res)=>{
    res.send("Welcome to node_api !!!");
})


app.listen(PORT,()=>{
    console.log("Server running on ",PORT);
})


