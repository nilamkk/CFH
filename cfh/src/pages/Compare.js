import { useState,useRef, Fragment } from 'react';

import '../components/Charts/chart.css'
import './Compare.css'

import User from '../components/Charts/UserInfoWithoutReq';
import Card from '../components/UI/Card/card';
import PieChart from '../components/Charts/pieChartWithoutReq';
import CfRatingGraph from '../components/Charts/cfRatingGraph'
import BarChart from '../components/Charts/barChartWithoutReq';
import ErrorHandler from '../components/ErrorHandler/ErrorHandler';
import OpenSpinner from '../components/Spinner/OpenSpinner'
import { getContestRating,getProblemsRate_SubPie_LangPie } from '../utils/profile';


const Compare=(props)=>{

    const [errorFound,setErrorFound]= useState(null)   // error message
    const [loading,setLoading]= useState(false)
    const [handle1State,setHandle1State]=useState(null) // valid handles infos
    const [handle2State,setHandle2State]=useState(null)
    const [user1Data,setUser1Data]= useState(null) // {problemRatDistUser1,submissionPieUser1,languagePieUser1  }
    const [user2Data,setUser2Data]= useState(null) // {problemRatDistUser2,submissionPieUser2,languagePieUser2  }

    const handle1Ref=useRef(null)
    const handle2Ref=useRef(null)


    const onSubmitCompareHandler=async(e)=>{
        e.preventDefault()
        const handle1= handle1Ref.current.value.trim()
        const handle2= handle2Ref.current.value.trim()

        // checking the validity of the handles
        try{
            setLoading(true)
            let link= `https://codeforces.com/api/user.info?handles=${handle1};${handle2}`
            // console.log("here1")
            const res= await fetch(link)
            let parsedRes
            if(!res.ok){
                if(res.statusText)
                    throw new Error(res.statusText)
                parsedRes= await res.json()
                throw new Error(parsedRes.comment)
            }
            parsedRes= await res.json()
            // console.log("here2")

            const [problemRatDistUser1,submissionPieUser1,languagePieUser1] =await getProblemsRate_SubPie_LangPie(handle1)
            const [problemRatDistUser2,submissionPieUser2,languagePieUser2] =await getProblemsRate_SubPie_LangPie(handle2)
            // console.log("here3")

            setUser1Data({
                problemRatDistUser1:problemRatDistUser1,
                submissionPieUser1:submissionPieUser1,
                languagePieUser1:languagePieUser1
            })
            setUser2Data({
                problemRatDistUser2:problemRatDistUser2,
                submissionPieUser2:submissionPieUser2,
                languagePieUser2:languagePieUser2
            })

            setLoading(false)
            setErrorFound(null)
            setHandle1State(parsedRes.result[0]) //////////////////// this is causing some problems
            setHandle2State(parsedRes.result[1])

        }catch(error){
            error.message=error.message.replace("handles: ","")
            setErrorFound(error.message)
            setLoading(false)
        }
    }

    let compareContents=null
    if(errorFound){
        compareContents= <ErrorHandler errorMessage={errorFound} modelRemovedHandler={()=>setErrorFound(null)}  />
    }else if( handle1State && handle2State ){
        compareContents=(
            <Fragment>
                <User userData={handle1State} userData2={handle2State}/>
                
                {/* handle from here */}
                
                <div style={{
                        padding: '2em',
                        display:'flex',
                        justifyContent:'space-between'
                    }}>
                        <Card header={`Problem-rating pie chart (${handle1State.handle})`} twoUser={true}>
                            <PieChart dataPoints={user1Data.problemRatDistUser1}  />
                        </Card>
                        
                        <Card header={`Problem-rating pie chart (${handle2State.handle})`} twoUser={true}>
                            <PieChart dataPoints={user2Data.problemRatDistUser2}  />
                        </Card>
                </div>

                <div style={{
                        padding: '2em',
                        display:'flex',
                        justifyContent:'space-between'
                    }}>
                        <Card header={`Submission pie chart (${handle1State.handle})`} twoUser={true}>
                            <PieChart  dataPoints={user1Data.submissionPieUser1} />
                        </Card> 
                        
                        <Card header={`Submission pie chart (${handle2State.handle})`} twoUser={true}>
                            <PieChart  dataPoints={user2Data.submissionPieUser2}  />
                        </Card> 
                </div>

                <div style={{
                        padding: '2em',
                        display:'flex',
                        justifyContent:'space-between'
                    }}>
                        <Card header={`Languages pie chart (${handle1State.handle})`} twoUser={true}>
                            <PieChart dataPoints={user1Data.languagePieUser1} />
                        </Card>
                        
                        <Card header={`Languages pie chart (${handle2State.handle})`} twoUser={true}>
                            <PieChart dataPoints={user2Data.languagePieUser2} />
                        </Card>
                </div>

                <div style={{
                        padding: '2em',
                        display:'flex',
                        justifyContent:'space-between'
                    }}>
                        <Card header={`Rating Wise Count of Accepted Questions (${handle1State.handle})`} twoUser={true}>
                            <BarChart dataPoints={user1Data.problemRatDistUser1} />
                        </Card>
                        
                        <Card header={`Rating Wise Count of Accepted Questions (${handle2State.handle})`} twoUser={true}>
                            <BarChart dataPoints={user2Data.problemRatDistUser2} />
                        </Card>
                </div>

                <div style={{
                        padding: '2em',
                        display:'flex',
                        justifyContent:'space-between'
                    }}>
                        <Card header={`Rated Participated Contests (${handle1State.handle})`} twoUser={true}>
                            <CfRatingGraph handle={handle1State.handle} getData={getContestRating}/>
                        </Card>
                        
                        <Card header={`Rated Participated Contests (${handle2State.handle})`} twoUser={true}>
                            <CfRatingGraph handle={handle2State.handle} getData={getContestRating}/>
                        </Card>
                    </div>

            </Fragment>
        )
    }



    return(
        <div>
            {loading?<OpenSpinner/>:null}

            <div className="compare-handles-div">
                <form onSubmit={onSubmitCompareHandler}  className="compare-handles-form">
                    <div>  
                        <label> 
                            <input  
                                type="input" 
                                placeholder="Handle 1"  
                                ref={handle1Ref}
                                required/>  
                        </label>  
                    </div>

                    <div>  
                        <label> 
                            <input  
                                type="input" 
                                placeholder="Handle 2"  
                                ref={handle2Ref}
                                required/>  
                        </label>  
                    </div>

                    <button type="submit" > Search</button>

                </form>
            </div>
            {/* show below only if handle1 handle2 exist and error not exist */}

            {compareContents}

        </div>
    )
}



export default Compare;