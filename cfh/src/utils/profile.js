import moment from 'moment'

const {getCategory,getRatingProblemsDist}=require('./functions')

export const getContestRating=async (handle)=>{

    // const data=await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
    const data=await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)

    const parsedData=await data.json()
    // {status: "FAILED", comment: "handle: User hhms not found"}
    console.log(parsedData)
    
    if(!data.ok){
        throw new Error(parsedData.comment)
    }
    
    const dataToSend=[]
    //  skipping: contest id 
    parsedData.result.forEach((item)=>{   //////////////////////////////
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
    console.log(dataToSend) ///////////////////////////////
    return dataToSend
}


export const getProblemsRating=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)  //////// this handle will be acquired from db when the user will be authenticated and will have his account in our site
    const parsedData=await data.json()
    console.log(parsedData)
    if(!data.ok){
        throw new Error(parsedData.error.message)
    }
    const dataToSend= getRatingProblemsDist(parsedData.result) //////////////////////////////
    
    return dataToSend
}


export const getUserProfile=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.info?handles=${handle}`) 
    const parsedData=await data.json()
    console.log(parsedData)
    if(!data.ok){
        throw new Error(parsedData.error.message)
    }

    const result=parsedData.result[0]

    return {
        "firstName":result.firstName,
        "lastName":result.lastName,
        "lastVisit":moment(result.lastOnlineTimeSeconds*1000).fromNow(),
        "country":result.country,
        "city":result.city,
        "rating":result.rating,
        "maxRating":result.maxRating,
        "photo":result.titlePhoto,
        "handle":result.handle,
        "category":result.rank,
        "maxCategory":result.maxRank
    }
}


export const getSubmissionPie=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`) 
    const parsedData=await data.json()
    // console.log(parsedData)
    if(!data.ok){
        throw new Error(parsedData.error.message)
    }

    const result=parsedData.result    /////////////////////////////////////////////////////
    const dataToSend=new Map()
    let len=result.length,i=0;
    while(i<len){
        if(!dataToSend[result[i].verdict])
            dataToSend[result[i].verdict]=1
        else
            dataToSend[result[i].verdict]+=1
        i++;
    }
    
    let objJSON=JSON.stringify(dataToSend)
    let obj= JSON.parse(objJSON)

    return  obj
}

export const getLanguagesUsedPie=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`) 
    const parsedData=await data.json()
    // console.log(parsedData)
    if(!data.ok){
        throw new Error(parsedData.error.message)
    }
    const result=parsedData.result    
    const dataToSend=new Map()
    let len=result.length,i=0;
    while(i<len){
        if(!dataToSend[result[i].programmingLanguage])
            dataToSend[result[i].programmingLanguage]=1
        else
            dataToSend[result[i].programmingLanguage]+=1
        i++;
    }
    
    let objJSON=JSON.stringify(dataToSend)
    let obj= JSON.parse(objJSON)

    return  obj
}