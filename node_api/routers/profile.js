const { performance } = require("perf_hooks")
const express= require('express')
const axios=require('axios')
const moment=require('moment')
const {getCategory,getRatingProblemsDist}=require('../utils/functions')


const router = new express.Router()

router.get('/yo',(req,res)=>{
    res.send("YOU !!!")
})

router.get('/contest-rating',async (req,res)=>{ 
    try{
        const handle="Hawkeye_2000" // have to receive from authentication
        const data=await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`) 
        const dataToSend=[]
        //  skipping: contest id and handle
        data.data.result.forEach((item)=>{
            const objToSend={
                contestName:item.contestName,
                rank:item.rank,
                updatedAt: item.ratingUpdateTimeSeconds, 
                // updatedAt: moment(item.ratingUpdateTimeSeconds*1000).format('DD/MM/YYYY'), 
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

router.get('/problems-rating',async (req,res)=>{   // correct--verified twice
    try{
        const handle="Hawkeye_2000" // have to receive from authentication
        const data=await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`)  //////// this handle will be acquired from db when the user will be authenticated and will have his account in our site
        const dataToSend= getRatingProblemsDist(data.data.result)
        res.send(dataToSend)
    }catch(error){
        console.log(error)
    }
})

router.get('/user-profile',async (req,res)=>{ 
    try{
        // const handle="striver_79" // have to receive from authentication
        const handle="Hawkeye_2000"
        const data=await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`) 

        const result=data.data.result[0]

        res.send({
            "firstName":result.firstName,
            "lastName":result.lastName,
            "lastVisit":moment(result.lastOnlineTimeSeconds*1000).fromNow(),
            "country":result.country,
            "city":result.city,
            "rating":result.rating,
            "maxRating":result.maxRating,
            "photo":"have to send",
            "handle":result.handle,
            "category":result.rank,
            "maxCategory":result.maxRank
        })
    }catch(error){
        console.log(error)
    }
})

router.get('/submissions-pi-info',async (req,res)=>{
    // FAILED, OK, PARTIAL, COMPILATION_ERROR, RUNTIME_ERROR, WRONG_ANSWER, PRESENTATION_ERROR, TIME_LIMIT_EXCEEDED, MEMORY_LIMIT_EXCEEDED, IDLENESS_LIMIT_EXCEEDED, SECURITY_VIOLATED, CRASHED, INPUT_PREPARATION_CRASHED, CHALLENGED, SKIPPED, TESTING, REJECTED. Can be absent.
    try{
        const handle="Hawkeye_2000" // For Um_nik, it took 78.62482610000112 seconds,60.72122929999977
        // const handle="striver_79" // For striver_79, it took 18.726451600000264 seconds.
        // const handle="Hawkeye_2000" // For Hawkeye_2000, it took 6.485499400999397 seconds,3.2269618999995293, 

        ////////////////////-----------------------------------------------------------------------------------------
        // var t0 = performance.now()
        ////////////////////-----------------------------------------------------------------------------------------

        const data=await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`) 
        const result=data.data.result
    
        const dataToSend=new Map()
        let len=result.length,i=0;
        while(i<len){
            if(!dataToSend[result[i].verdict])
                dataToSend[result[i].verdict]=1
            else
                dataToSend[result[i].verdict]+=1
            i++;
        }
        
        ////////////////////-----------------------------------------------------------------------------------------
        // var t1 = performance.now()
        // console.log("For "+ handle+", it took " + (t1 - t0)/1000 + " seconds.")
        ////////////////////-----------------------------------------------------------------------------------------
        res.send(dataToSend)
    }catch(error){
        console.log(error)
    }
})


module.exports= router



        // {
        //     "FAILED":0, 
        //     "OK":0, 
        //     "PARTIAL":0, 
        //     "COMPILATION_ERROR":0, 
        //     "RUNTIME_ERROR":0, 
        //     "WRONG_ANSWER":0, 
        //     "PRESENTATION_ERROR":0, 
        //     "TIME_LIMIT_EXCEEDED":0, 
        //     "MEMORY_LIMIT_EXCEEDED":0, 
        //     "IDLENESS_LIMIT_EXCEEDED":0, 
        //     "SECURITY_VIOLATED":0, 
        //     "CRASHED":0, 
        //     "INPUT_PREPARATION_CRASHED":0, 
        //     "CHALLENGED":0, 
        //     "SKIPPED":0, 
        //     "TESTING":0, 
        //     "REJECTED":0,
        //     "unknown":0 //Can_be_absent
        // }
           // if( item.verdict==="FAILED" ){
            //     dataToSend["FAILED"]+=1;
            // }else if(item.verdict==="OK"){
            //     dataToSend["OK"]+=1;
            // }else if(item.verdict==="PARTIAL"){
            //     dataToSend["PARTIAL"]+=1;
            // }else if(item.verdict==="COMPILATION_ERROR"){
            //     dataToSend["COMPILATION_ERROR"]+=1;
            // }else if(item.verdict==="RUNTIME_ERROR"){
            //     dataToSend["RUNTIME_ERROR"]+=1;
            // }else if(item.verdict==="WRONG_ANSWER"){
            //     dataToSend["WRONG_ANSWER"]+=1;
            // }else if(item.verdict==="PRESENTATION_ERROR"){
            //     dataToSend["PRESENTATION_ERROR"]+=1;
            // }else if(item.verdict==="TIME_LIMIT_EXCEEDED"){
            //     dataToSend["TIME_LIMIT_EXCEEDED"]+=1;
            // }else if(item.verdict==="MEMORY_LIMIT_EXCEEDED"){
            //     dataToSend["MEMORY_LIMIT_EXCEEDED"]+=1;
            // }else if(item.verdict==="IDLENESS_LIMIT_EXCEEDED"){
            //     dataToSend["IDLENESS_LIMIT_EXCEEDED"]+=1;
            // }else if(item.verdict==="SECURITY_VIOLATED"){
            //     dataToSend["SECURITY_VIOLATED"]+=1;
            // }else if(item.verdict==="CRASHED"){
            //     dataToSend["CRASHED"]+=1;
            // }else if(item.verdict==="INPUT_PREPARATION_CRASHED"){
            //     dataToSend["INPUT_PREPARATION_CRASHED"]+=1;
            // }else if(item.verdict==="CHALLENGED"){
            //     dataToSend["CHALLENGED"]+=1;
            // }else if(item.verdict==="SKIPPED"){
            //     dataToSend["SKIPPED"]+=1;
            // }else if(item.verdict==="TESTING"){
            //     dataToSend["TESTING"]+=1;
            // }else if(item.verdict==="REJECTED"){
            //     dataToSend["REJECTED"]+=1;
            // }else if(item.verdict==="unknown"){
            //     dataToSend["unknown"]+=1
            // }
    