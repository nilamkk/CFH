const express= require('express')
const axios=require('axios')
const moment=require('moment')
const {getCategory}=require('../utils/functions')


const router = new express.Router()




router.get('/yo',(req,res)=>{
    res.send("YOU !!!")
})

router.get('/contest-rating',async (req,res)=>{
    try{
        const handle="striver_79" // have to receive from authentication
        const data=await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`) 
        const dataToSend=[]
        //  skipping: contest id and handle
        data.data.result.forEach((item)=>{
            const objToSend={
                contestName:item.contestName,
                rank:item.rank,
                updatedAt: moment(item.ratingUpdateTimeSeconds*1000).format('DD/MM/YYYY'), 
                changeInRating: item.newRating-item.oldRating,
                newRating:item.newRating,
                newCategory: getCategory(item.newRating)
            }
            dataToSend.push(objToSend)
        })
        res.send(dataToSend)
    }catch(error){
        console.log(error)
    }
})










module.exports= router