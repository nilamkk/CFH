const express=require('express');
const profileRouter=require('./routers/profile');



const app= express();



app.use(express.json());
app.use(profileRouter);






app.get('/',(req,res)=>{
    res.send("Welcome to node_api !!!");
})






app.listen(3080,()=>{
    console.log("Server running on 3080");
})


