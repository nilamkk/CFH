const fetch=require('node-fetch')
const Problem= require('../models/problems')
const schedule=require('node-schedule')


const doThis=async ()=>{
    try{
        let url=`https://codeforces.com/api/problemset.problems`
        const result=await fetch(url)
        const parsedResult=await result.json()

        if(!result.ok){
            throw new Error(parsedResult.error.message)
        }
        let cnt=0
        parsedResult.result.problems.forEach(async(item)=>{
            const problem= new Problem(item)
            await problem.save()
            cnt++;
        })
        console.log("Saved: ",cnt)
        console.log(parsedResult.result.problems.length)
    }catch(error){
        console.log(error)
    }
}

const updateDBRegularly= async()=>{
    try{
        let url=`https://codeforces.com/api/problemset.problems`
        const result=await fetch(url)
        let parsedResult
        if(!result.ok){
            if(result.statusText)
                throw new Error(result.statusText)
                parsedResult=await result.json()
            throw new Error(parsedResult.comment)
        }
        parsedResult=await result.json()

        const presentProblems= await Problem.find({})

        console.log("Total problems before updation ",presentProblems.length)

        let i=0
        let cnt=0
        for(i=0;i< Math.min(300,parsedResult.result.problems.length);i++){
            let found=false
            for( let j=0;j<presentProblems.length;j++ ){
                if( 
                    presentProblems[j].contestId.toString().trim() === parsedResult.result.problems[i].contestId.toString().trim() &&
                    presentProblems[j].index.toString().toUpperCase().trim() === parsedResult.result.problems[i].index.toString().toUpperCase().trim() &&
                    presentProblems[j].name.toString().toUpperCase().trim() === parsedResult.result.problems[i].name.toString().toUpperCase().trim() &&
                    presentProblems[j].type.toString().toUpperCase().trim() === parsedResult.result.problems[i].type.toString().toUpperCase().trim() 
                ){
                    found=true;
                    break;
                }
            }
            if(!found){
                const problem= new Problem( parsedResult.result.problems[i] )
                await problem.save()
                cnt++;
            }
        }
        console.log("Updated new problems : ",cnt)
    }catch(error){
        console.log(error)
    }
}

// This will run every 12 hours
const regularUpdateJob=schedule.scheduleJob('regularly-update-DB','0 */12 * * *',async ()=>{
    updateDBRegularly()
    .then(
        res=>console.log("Done")
    ).catch(
        error=>console.log(error)
    )
})


/*

// Use this function for only first time to create the DB

doThis()
.then((res)=>{
    console.log("All saved!!!")
})
.catch(
    error=>console.log("Error aahise...",error)
) 
 */
