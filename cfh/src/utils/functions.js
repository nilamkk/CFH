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

    // console.log("No of OK questions: ",cnttt)

    return dataToSend
}

const getTimeFormat=(unix_timestamp)=>{
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000 );
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + date.getSeconds();

    let dates= date.getDate()
    let month= date.getMonth()+1
    let year= date.getFullYear()

    // Will display time in 10:30:23 format
    let formattedTime = dates+'/'+month+'/'+year+'   '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime
}
const getDurationFormat=(timeInSeconds)=>{
    let minutes,hours, days,months,format=""

    minutes= timeInSeconds/60

    hours= Math.floor(minutes/60)

    days= Math.floor(hours/24)

    months= Math.floor(days/30)

    if(minutes>60){
        minutes= minutes%60
    }
    if(hours>24){
    hours= hours%24
    }
    if(days>30){
        days= days%30
    }
    if(months)
        format= months+" months "

    if(days)
        format+= days+" days "

    if(hours)
    format+= hours+" hrs "

    if(minutes){
        format += (minutes+" mins")
    }

    return format

}

const getDateMonthYear=(timeInMS)=>{
    const d= new Date(timeInMS)
    const date= d.getDate()
    const month= d.getMonth()+1
    const year= d.getFullYear()

    return (d+"/"+month+"/"+year)
}

module.exports={getCategory,getRatingProblemsDist,getTimeFormat,getDurationFormat,getDateMonthYear}
