// user.rating- 1 (2)
// user.status- 3 (2) [ getProblemsRating,getSubmissionPie, getLanguagesUsedPie]
// user.info  - 1 (1)

// import moment from 'moment'

const {getCategory,getRatingProblemsDist}=require('./functions')


// single
export const getContestRating=async (handle)=>{

    const data=await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)

    let parsedData
    if(!data.ok){
        if(data.statusText)
            throw new Error(data.statusText)
        parsedData=await data.json()
        throw new Error(parsedData.comment)
    }
    parsedData=await data.json()
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
    return dataToSend
}

// single
// export const getUserProfile=async (handle)=>{
//     const data=await fetch(`https://codeforces.com/api/user.info?handles=${handle}`) 

//     let parsedData
//     if(!data.ok){
//         if(data.statusText)
//             throw new Error(data.statusText)
//         parsedData=await data.json()
//         throw new Error(parsedData.error.message)
//     }
//     parsedData=await data.json()

//     const result=parsedData.result[0]

//     return {
//         "firstName":result.firstName,
//         "lastName":result.lastName,
//         "lastVisit":moment(result.lastOnlineTimeSeconds*1000).fromNow(),
//         "country":result.country,
//         "city":result.city,
//         "rating":result.rating,
//         "maxRating":result.maxRating,
//         "photo":result.titlePhoto,
//         "handle":result.handle,
//         "category":result.rank,
//         "maxCategory":result.maxRank
//     }
// }

// can be done in a single request
export const getProblemsRating=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)  /////////////////////////////////
    let parsedData
    if(!data.ok){
        if(data.statusText)
            throw new Error(data.statusText)
        parsedData=await data.json()
        throw new Error(parsedData.comment)
    }
    parsedData=await data.json()
    const dataToSend= getRatingProblemsDist(parsedData.result) 
    
    return dataToSend
}
export const getSubmissionPie=async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)   /////////////////////////////////

    let parsedData
    if(!data.ok){
        if(data.statusText)
            throw new Error(data.statusText)
        parsedData=await data.json()
        throw new Error(parsedData.comment)
    }
    parsedData=await data.json()

    const result=parsedData.result    
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
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)  /////////////////////////////////

    let parsedData
    if(!data.ok){
        if(data.statusText)
            throw new Error(data.statusText)
        parsedData=await data.json()
        throw new Error(parsedData.comment)
    }
    parsedData=await data.json()

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






export const getProblemsRate_SubPie_LangPie= async (handle)=>{
    const data=await fetch(`https://codeforces.com/api/user.status?handle=${handle}`)  
    let parsedData
    if(!data.ok){
        if(data.statusText)
            throw new Error(data.statusText)
        parsedData=await data.json()
        throw new Error(parsedData.comment)
    }
    parsedData=await data.json()

    // rating prooblem districution
    const dataToSend1= getRatingProblemsDist(parsedData.result) 

    // submission pie
    const result=parsedData.result    
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

    // language pie
    const result2=parsedData.result
    
    
    const dataToSend2=new Map()
    let len2=result2.length,i2=0;
    while(i2<len2){
        if(!dataToSend2[result2[i2].programmingLanguage])
            dataToSend2[result2[i2].programmingLanguage]=1
        else
            dataToSend2[result2[i2].programmingLanguage]+=1
        i2++;
    }
    
    let objJSON2=JSON.stringify(dataToSend2)
    let obj2= JSON.parse(objJSON2)

    return [dataToSend1,obj,obj2]
}