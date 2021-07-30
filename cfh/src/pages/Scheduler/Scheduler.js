import {useState,useEffect,useContext} from 'react'

import AuthContext from '../../store/auth-context'
import Contests from '../../components/scheduler/Contests';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler'
import OpenSpinner from '../../components/Spinner/OpenSpinner'

import './Scheduler.css'

const map_urlname_to_returnname={
    codeforces:"CodeForces",
    code_chef:"CodeChef",
    hacker_rank:"HackerRank",
    hacker_earth:"HackerEarth",
    leet_code:"LeetCode",
    kick_start:"Kick Start",
    top_coder:"TopCoder",
    at_coder:"AtCoder",
    cs_academy:"CS Academy"
}


const Scheduler=(props)=>{
    console.log("Scheduler")
    
    const [listOfUpcomingContests,setListOfUpcomingContests]=useState(null);
    
    const [lowerBound,setLowerBound]=useState(null)
    const [upperBound,setUpperBound]=useState(null)
    const [selectedPlatforms,setSelectedPlatforms]=useState({
        codeforces:true,
        code_chef:false,
        hacker_rank:false,
        hacker_earth:false,
        leet_code:false,
        kick_start:false,
        top_coder:false,
        at_coder:false,
        cs_academy:false
    })
    const [showRemContestsOnly,setShowRemContestsOnly]=useState(false)

    const [showError,setShowError] =useState(null)
    const [loading,setLoading]=useState(false)


    const authCntx=useContext(AuthContext)

    useEffect(()=>{
        const fetchData=async()=>{
            let url=`https://kontests.net/api/v1/all`
            setLoading(true)
            try{
                const res= await fetch(url)
                
                let parsedRes
                if(!res.ok){
                    if(res.statusText)
                        throw new Error(res.statusText)
                    parsedRes=await res.json();
                    throw new Error(parsedRes.error.message) ////////////////////////////////
                }
                parsedRes=await res.json();

                url=`/get-user-reminder-contests?LocalId=${authCntx.localId}`
                const userRemContests= await fetch(url)
                
                let parsedURC
                if(!userRemContests.ok){
                    if(userRemContests.statusText)
                        throw new Error(userRemContests.statusText)
                    parsedURC= await userRemContests.json()
                    throw new Error(parsedURC.error.message)
                }
                parsedURC= await userRemContests.json()

                // add reminder status for each parsedRes's item
                for(let i=0;i<parsedRes.length;i++){                                //******************************** */

                    let itemToSearch={
                        name:parsedRes[i].name,
                        site:parsedRes[i].site,
                        start_time:new Date(parsedRes[i].start_time).getTime()
                    }

                    let ExistC=false
                    for(let j=0;j<parsedURC.length;j++){
                        let d2=new Date(parsedURC[j].start_time).getTime() 
                        
                        if(parsedURC[j].name===itemToSearch.name
                            && parsedURC[j].site===itemToSearch.site 
                            && d2===itemToSearch.start_time )
                        {
                            ExistC=true;
                            break;
                        }
                    }
                    
                    if(ExistC){
                        parsedRes[i].reminderAdded=true
                    }else{
                        parsedRes[i].reminderAdded=false
                    }
                
                }
                setLoading(false)
                setShowError(null)
                setListOfUpcomingContests(parsedRes)
            }catch(error){
                console.log(error)
                setLoading(false)
                setShowError(error.message)
            }
        }
        fetchData();
        // console.log("fetching done")

    },[])

    const updateReminderStatusAfterRemRemove=(itemContest)=>{
        let newListOfUpComingCnts=[...listOfUpcomingContests]

        for(let i=0;i<newListOfUpComingCnts.length;i++){
            if( newListOfUpComingCnts[i].name===itemContest.name
                && newListOfUpComingCnts[i].site===itemContest.site
                && (new Date(newListOfUpComingCnts[i].start_time).getTime())  ===  (new Date(itemContest.start_time).getTime() ) )
            {
                newListOfUpComingCnts[i].reminderAdded=false;
                break;
            }
        }
        setListOfUpcomingContests(newListOfUpComingCnts)
    }
    const updateReminderStatusAfterRemAddition=(itemContest)=>{
        let newListOfUpComingCnts=[...listOfUpcomingContests]

        for(let i=0;i<newListOfUpComingCnts.length;i++){
            if( newListOfUpComingCnts[i].name===itemContest.name
                && newListOfUpComingCnts[i].site===itemContest.site
                // && newListOfUpComingCnts[i].contestLink===itemContest.contestLink  ///////////////////////////////////// problem999
                && (new Date(newListOfUpComingCnts[i].start_time).getTime())  ===  (new Date(itemContest.start_time).getTime() ) )
            {
                newListOfUpComingCnts[i].reminderAdded=true;
                break;
            }
        }
        setListOfUpcomingContests(newListOfUpComingCnts)
    }

    const handleInputChange=(e)=>{
        const target=e.target
        const value=target.checked
        const name=target.name
        setSelectedPlatforms(state=>({
            ...state,
            [name]:value
        }))
    }
    const handleShowRemContCHnage=(e)=>{
        // console.log( e.target.checked )
        setShowRemContestsOnly(e.target.checked)
    }

    const timeChangeHandler=(e)=>{
        if(e.target.name==="lower"){
            setLowerBound(new Date(e.target.value))
        }else{
            setUpperBound(new Date(e.target.value))
        }
    }

    let listOfSelectedContests=[]

    if(listOfUpcomingContests){

        let dupSelectedPlatforms=[]
        Object.keys(selectedPlatforms).forEach(
            key=> {
                if(selectedPlatforms[key]===true){
                    dupSelectedPlatforms.push(map_urlname_to_returnname[key]);
                }
            }
        )
        // dupSelectedPlatforms is empty when all are false => No contests 
        // dupSelectedPlatforms is not empty when atleast one is true => show selected contests
        
        if(dupSelectedPlatforms.length!==0){
            for(let i=0;i<listOfUpcomingContests.length;i++){
                let siteName=listOfUpcomingContests[i].site
                if( dupSelectedPlatforms.includes(siteName) 
                    &&  (lowerBound?(lowerBound<=(new Date(listOfUpcomingContests[i].start_time))):true) 
                    &&  (upperBound?((new Date(listOfUpcomingContests[i].start_time))<=upperBound):true)  )
                {   
                    if( showRemContestsOnly && listOfUpcomingContests[i].reminderAdded===false){
                        continue;
                    }

                    listOfSelectedContests.push(listOfUpcomingContests[i])
                }
            }
        }
    }
    // sort "listOfSelectedContests" if needed

    let showAllContests
    if(listOfUpcomingContests===null){
        showAllContests=null
    }else if(listOfSelectedContests.length!==0 ){
        showAllContests= <Contests 
                            listOfSelectedContests={listOfSelectedContests}
                            LocalId={authCntx.localId}
                            updateReminderStatusAfterRemRemove={updateReminderStatusAfterRemRemove}
                            updateReminderStatusAfterRemAddition={updateReminderStatusAfterRemAddition}/>
    }else{
        showAllContests=<p>No contests found</p>
    }

    return(
        <div  className="Scheduler-container">
            {loading?<OpenSpinner/>:null}

            {showError?<ErrorHandler errorMessage={showError} modelRemovedHandler={()=>setShowError(null)} />:null}

            <div className="Scheduler-left-side-contest-lists">
                {/* List of all contests here */}
                <p className="text-primary font-weight-bold">All Upcoming Contests</p>
                {showAllContests}
            </div>

            <div className="Scheduler-right-side-filters text-secondary-scheduler">

                {/* contests filter here */}
                <p className="text-primary font-weight-bold">Filters</p>
                <div>
                    <form>

                        <div className="label-div">
                            <label>
                            <input
                                name="codeforces"
                                type="checkbox"
                                checked={selectedPlatforms.codeforces}
                                onChange={handleInputChange} />
                            CodeForces
                            </label>
                        </div>

                        <div className="label-div">
                            <label>
                            <input
                                name="code_chef"
                                type="checkbox"
                                checked={selectedPlatforms.code_chef}
                                onChange={handleInputChange} />
                            CodeChef
                            </label>
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="hacker_rank"
                                type="checkbox"
                                checked={selectedPlatforms.hacker_rank}
                                onChange={handleInputChange} />
                            HackerRank
                            </label>
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="hacker_earth"
                                type="checkbox"
                                checked={selectedPlatforms.hacker_earth}
                                onChange={handleInputChange} />
                            HackerEarth
                            </label>
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="leet_code"
                                type="checkbox"
                                checked={selectedPlatforms.leet_code}
                                onChange={handleInputChange} />
                            LeetCode
                            </label>    
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="kick_start"
                                type="checkbox"
                                checked={selectedPlatforms.kick_start}
                                onChange={handleInputChange} />
                            Kick Start
                            </label>
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="top_coder"
                                type="checkbox"
                                checked={selectedPlatforms.top_coder}
                                onChange={handleInputChange} />
                            TopCoder
                            </label>
                        </div>
                        
                        
                        
                        <div className="label-div">
                            <label>
                            <input
                                name="at_coder"
                                type="checkbox"
                                checked={selectedPlatforms.at_coder}
                                onChange={handleInputChange} />
                            AtCoder
                            </label>
                        </div>


                        <div className="label-div">
                            <label>
                            <input
                                name="cs_academy"
                                type="checkbox"
                                checked={selectedPlatforms.cs_academy}
                                onChange={handleInputChange} />
                            CS Academy
                            </label>
                        </div>



                        <div className="label-div">
                            <label>
                            <input
                                name="showRemCont"
                                type="checkbox"
                                checked={showRemContestsOnly}
                                onChange={handleShowRemContCHnage} />
                            Reminder Added Contests
                            </label>
                        </div>

                    </form>
                </div>

                {/*  Time filters here */}
                <p className="text-primary font-weight-bold">Time</p>

                <div className="label-div">
                    <label>
                        Lower bound:
                        <input type="date" name="lower" onChange={timeChangeHandler} />
                    </label>
                </div>

                <div className="label-div">
                    <label>
                        Upper bound:
                        <input type="date" name="upper" onChange={timeChangeHandler} />
                    </label>
                </div>



            </div>

        </div>
    )
}



export default Scheduler;