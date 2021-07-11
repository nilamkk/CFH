const getCategory=(rating)=>{
    if(rating<1200)
        return "newbie"
    if(1200<=rating && rating<1400)
        return "pupil"
    if(1400<=rating&& rating<1600)
        return "specialist"
    if(1600<=rating && rating<1900)
        return "expert"
    if(1900<=rating && rating<2100)
        return "candidate master"
    if(2100<=rating && rating<2300 )
        return "master"
    if(2300<=rating && rating<2400)
        return "international master"
    if(2400<=rating && rating<2600 )
        return "grandmaster"
    if(2600<=rating && rating<3000)
        return "international grandmaster"
    return "legendary grandmaster"
}

const getProblemId=(problem)=>{
    // contestId_index_nameFirstLetters_typeFirstLetter_points_rating   
    let problemId=""
    if(problem.contestId){
        problemId+= problem.contestId+"-"
    }
    problemId+= problem.index+"-"
    problem.name.split(" ").forEach((word)=>{
        problemId+=word[0]
    })
    problemId+=problem.type[0]
    if(problem.points){
        problemId+="-"+problem.points
    }
    if(problem.rating){
        problemId+="-"+problem.rating
    }
    return problemId
}

const getRatingProblemsDist=(result)=>{
    const verdictOk=new Set()
    const dataToSend={
        "0-499":0,   //"0-499"
        "500-999":0, //"500-999":0,
        "1000-1499":0, //"1000-1499":0,
        "1500-1999":0, //"1500-1999":0,
        "2000-2499":0,
        "2500-2999":0,
        "3000-3499":0,
        ">3500":0,
        "unrated":0
    }
    let cnttt=0;
    result.forEach((item)=>{
        if(item.verdict==="OK"){
            cnttt+=1
            const problemId=getProblemId(item.problem)

            if( verdictOk.has(problemId)===false ){
                if( item.problem.rating<500){
                    dataToSend["0-499"]++;
                }else if(item.problem.rating<=999){
                    dataToSend["500-999"]++;
                }else if(item.problem.rating<=1499){
                    dataToSend["1000-1499"]++;
                }else if(item.problem.rating<=1999){
                    dataToSend["1500-1999"]++;
                }else if(item.problem.rating<=2499){
                    dataToSend["2000-2499"]++;
                }else if(item.problem.rating<=2999){
                    dataToSend["2500-2999"]++;
                }else if(item.problem.rating<=3499){
                    dataToSend["3000-3499"]++;
                }else if(3500<=item.problem.rating ){
                    dataToSend[">3500"]++;
                }else{
                    dataToSend[ "unrated"]++;
                }
                verdictOk.add( problemId ) 
            }
        }
    })

    console.log("No of OK questions: ",cnttt)

    return dataToSend
}



module.exports={getCategory,getRatingProblemsDist}
