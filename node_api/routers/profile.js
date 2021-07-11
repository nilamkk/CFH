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
            "photo":result.titlePhoto,
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
    














            /*
            
  async componentDidMount(){
    if(this.state.data.length!==0)
      return;
    let handle=authCntx.Handle
    // when authentication will be added, have to maintain session/other things for authentication
    try{
      let data=null
      if(this.props.chartTitle==="Rating Wise Count of Accepted Questions"){
        const data= await getProblemsRating(handle)
      }else if(this.props.chartTitle==="Rated Participated Contests"){
        data= await getContestRating(handle)   
      }else if(this.props.chartTitle==="Submission pie chart"){
        data= await getSubmissionPie(handle)
      }else if(this.props.chartTitle==="Problem-rating pie chart"){
        const data= await getProblemsRating(handle)
      }


      console.log(data.data)

      let dataPoints=[]
      if(this.props.chartTitle==="Rating Wise Count of Accepted Questions"){
        // dataPoints=[                                                                          
        //   {label:"0-499",y:10},   
        //   {label:"500-999",y:20}, 
        //   {label:"1000-1499",y:20}, 
        //   {label:"1500-1999",y:60}, 
        //   {label:"2000-2499",y:20},
        //   {label:"2500-2999",y:30},
        //   {label:"3000-3499",y:40},
        //   {label:">3500",y:15}
        // ]
        // data.data is an object
        for(let prop in data.data){
          dataPoints.push({
            label:prop,
            y: parseInt(data.data[prop])  
          })
        } 
      }else if(this.props.chartTitle==="Rated Participated Contests"){
        // dataPoints=[                                                                        
        //   { x: new Date(2017, 0,1), y: 0 },
        //   { x: new Date(2017, 0,3), y: 480 },
        //   { x: new Date(2017, 0,5), y: 790 },
        //   { x: new Date(2017, 0,10), y: 1000 },
        //   { x: new Date(2017, 0,15), y: 1100 },
        //   { x: new Date(2017, 0,20), y: 999 },
        //   { x: new Date(2017, 0,23 ), y: 1050 },
        //   { x: new Date(2017, 0,26), y: 1132 },
        //   { x: new Date(2017, 8), y: 1200 },
        //   { x: new Date(2017, 9), y: 1212 },
        //   { x: new Date(2017, 10), y: 1250 },
        //   { x: new Date(2017, 11), y: 1300 },
        //   { x: new Date(2018, 0,1), y: 1700 },
        //   { x: new Date(2018, 0,1), y: 2100 }
        // ]
        // data.data is an array
        for(let i=0;i<data.data.length;i++){
          dataPoints.push({
            x: new Date(data.data[i].updatedAt*1000),
            y: parseInt(data.data[i].newRating),
            toolTipContent:`<p>=${data.data[i].newRating} (${(data.data[i].changeInRating>0?"+":"")}${data.data[i].changeInRating}),${data.data[i].newCategory}</p><p>Rank:${data.data[i].rank}</p><p>${data.data[i].contestName}</p><p>${moment(data.data[i].updatedAt*1000).format('DD/MM/YYYY')}</p>`
          })
        }
      }else if(this.props.chartTitle==="Submission pie chart" || this.props.chartTitle==="Problem-rating pie chart"){
        for(let prop in data.data){
          dataPoints.push({
            y: parseInt(data.data[prop]),
            label:prop,
            color:customPieColors[prop],
            toolTipContent:`<p>${prop}</p><p>Count: ${data.data[prop]}</p>`
          })
        }
      }
  
  
      let oldData=[...this.state.data]
      oldData.push({
        dataPoints:dataPoints
      })
      this.setState({
        data:oldData
      }) 

    }catch(error){
      console.log(error)
    }

    
  }

            
            */