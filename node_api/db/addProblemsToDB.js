require('./mongoose')
const fetch=require('node-fetch')
const Problem= require('../models/problems')


const doThis=async ()=>{
    try{
        let url=`https://codeforces.com/api/problemset.problems`
        const result=await fetch(url)
        const parsedResult=await result.json()

        if(!result.ok){
            throw new Error(parsedResult.error.message)
        }

        parsedResult.result.problems.forEach(async(item)=>{
            const problem= new Problem(item)
            await problem.save()
        })

        console.log(parsedResult.result.problems.length)
    }catch(error){
        console.log(error)
    }
}

doThis()
.then((res)=>{
    console.log("All saved!!!")
})
.catch(
    error=>console.log("Error aahise...",error)
)

