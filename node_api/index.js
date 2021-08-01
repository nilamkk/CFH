const dotenv =require('dotenv');
dotenv.config();
require('./db/mongoose')

// Below is for DB automatic updation
require('./db/addProblemsToDB.js')
// the below is the scheduling part
require('./utils/schedulingTasks')

const express=require('express');

const cors = require('cors');

// Set up a whitelist and check against it:
var whitelist = ['https://code-buddy-cfh.netlify.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// Then pass them to cors:
const app= express();

app.use(cors(corsOptions));


const profileRouter=require('./routers/profile');
const userRouter=require('./routers/user')
const oldProblemsRouter=require('./routers/oldProblems')



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