const express= require('express')
const User=require('../models/user')
const Problem=require('../models/problems') 
const mongoose = require('mongoose')

const router = new express.Router()

router.get('/wow',(req,res)=>{
    res.send("wow !!!")
})

router.post('/add-category',async (req,res)=>{              
    //{LocalId,title}
    try{
        let user=await User.findOne({LocalId:req.body.LocalId})
        user.Categories.push({
            title:req.body.title,
            problems:[]
        })
        user=await user.save()
        res.send(user.Categories)
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
router.get('/get-category',async (req,res)=>{              
    //{LocalId}
    try{
        let user=await User.findOne({LocalId:req.query.LocalId})
        res.send(user.Categories) // an array, have to remove problems later
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
router.delete('/delete-category',async (req,res)=>{         
    //{LocalId,title,id}
    try{
        let user=await User.findOne({LocalId:req.body.LocalId})
        
        let ind=-1
        for(let i=0;i<user.Categories.length;i++){
            if(user.Categories[i].title===req.body.title && 
                user.Categories[i]._id===req.body.id )
            {
                ind=i;
                break;
            }
        }
        user.Categories.splice(ind,1)
        user=await user.save()

        res.send(user.Categories)
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
router.post('/add-problems-to-category',async (req,res)=>{   
    // {LocalId,title,problemId}  // categoryId
    try{
        let user=await User.findOne({LocalId:req.body.LocalId})
        
        let ind=-1
        for(let i=0;i<user.Categories.length;i++){
            if(user.Categories[i].title===req.body.title){
                ind=i;
                break;
            }
        }
        user.Categories[ind].problems.push(mongoose.Types.ObjectId(req.body.problemId))
        user=await user.save()

        res.send(user.Categories[ind])  ////// return sabo lagibo
    }catch(error){
        console.log(error)
    }
})
router.get('/get-problems-from-category',async (req,res)=>{        
    //{LocalId,title,id}
    try{
        
        let user=await User.findOne({LocalId:req.query.LocalId})

        let ind=-1
        for(let i=0;i<user.Categories.length;i++){
            if(user.Categories[i].title===req.query.title && 
                user.Categories[i]._id.toString()===req.query.id )
            {
                ind=i;
                break;
            }
        }
        // use `doc.populate("arr.0.path")`
        await user.populate(`Categories.${ind}.problems`).execPopulate()
        
        res.send(user.Categories[ind])// an object 
    }catch(error){
        console.log(error)
        res.send(error)
    }
})
router.get('/get-problem-by-name',async(req,res)=>{
    // {name of the problem,LocalId}
    try{
        // will search the given name containing word string in db
        const re= new RegExp(".*"+req.query.name+".*")
        const problems=await Problem.find( { 'name' : { $regex:re, $options:'i' } } )
        
        // adding category property to the problems
        const user=await User.findOne({LocalId:req.query.LocalId})

        const problemsToSend=problems.map(
            item=>{
                let idOfProblem=item._id.toString()
                let ind=-1;
                for(let j=0;j<user.Categories.length;j++){
                    for(let k=0;k<user.Categories[j].problems.length;k++){
                        if(idOfProblem===user.Categories[j].problems[k].toString()){
                            ind=j;
                            break;
                        }
                    }
                    if(ind!==-1){
                        break
                    }
                }
                let newProblem={
                    _id:item._id,
                    tags:item.tags,
                    contestId:item.contestId,
                    index:item.index,
                    name:item.name,
                    type:item.type,
                    points:item.points
                }
                // ind==-1 or ind has some other value
                if(ind===-1)
                    return newProblem
                newProblem.category=user.Categories[ind].title
                return newProblem;
            }
        )
        res.send(problemsToSend)  // array of problems
    }catch(error){
        res.send(error)
    }


})



module.exports= router

