import {useState,useEffect,useContext} from 'react'

import AuthContext from '../../store/auth-context'
import Contests from '../../components/scheduler/Contests';

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

    const authCntx=useContext(AuthContext)

    useEffect(()=>{
        // console.log("fetching data")                                                 
        const fetchData=async()=>{
            // console.log("fetching between 1")
            let url=`https://kontests.net/api/v1/all`
            try{
                const res= await fetch(url)
                const parsedRes=await res.json();
                if(!res.ok){
                    throw new Error(parsedRes.error.message) ////////////////////////////////
                }
                // console.log("fetching between 2")
                // /get-user-reminder-contests
                url=`/get-user-reminder-contests?LocalId=${authCntx.localId}`
                const userRemContests= await fetch(url)
                const parsedURC= await userRemContests.json()
                if(!userRemContests.ok){
                    throw new Error(parsedURC.error.message)
                }
                // console.log(parsedURC)
                // console.log("fetching between 3")

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
                        
                        // console.log(parsedURC[j].name," ",itemToSearch.name," ",(parsedURC[j].name===itemToSearch.name))
                        // console.log(parsedURC[j].site," ",itemToSearch.site," ",parsedURC[j].site===itemToSearch.site)
                        // console.log(d2," ",itemToSearch.start_time," ",d2===itemToSearch.start_time)


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

                setListOfUpcomingContests(parsedRes)
            }catch(error){
                console.log(error)
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
        showAllContests=<p>Loading...</p>
    }else if(listOfSelectedContests.length!==0 ){
        showAllContests= <Contests 
                            listOfSelectedContests={listOfSelectedContests}
                            LocalId={authCntx.localId}
                            updateReminderStatusAfterRemRemove={updateReminderStatusAfterRemRemove}
                            updateReminderStatusAfterRemAddition={updateReminderStatusAfterRemAddition}/>
    }else{
        showAllContests=<p>No contests to found</p>
    }

    
    return(
        <div>
            Hello I am Scheduler
            
            <hr/>
            <p>Filters</p>

            <div>

                <form>
                    <label>
                    <input
                        name="codeforces"
                        type="checkbox"
                        checked={selectedPlatforms.codeforces}
                        onChange={handleInputChange} />
                    CodeForces
                    </label>
                    <br />

                    <label>
                    <input
                        name="code_chef"
                        type="checkbox"
                        checked={selectedPlatforms.code_chef}
                        onChange={handleInputChange} />
                    CodeChef
                    </label>
                    <br />                

                    <label>
                    <input
                        name="hacker_rank"
                        type="checkbox"
                        checked={selectedPlatforms.hacker_rank}
                        onChange={handleInputChange} />
                    HackerRank
                    </label>
                    <br />                
                    
                    <label>
                    <input
                        name="hacker_earth"
                        type="checkbox"
                        checked={selectedPlatforms.hacker_earth}
                        onChange={handleInputChange} />
                    HackerEarth
                    </label>
                    <br />                
                    
                    <label>
                    <input
                        name="leet_code"
                        type="checkbox"
                        checked={selectedPlatforms.leet_code}
                        onChange={handleInputChange} />
                    LeetCode
                    </label>
                    <br />

                    <label>
                    <input
                        name="kick_start"
                        type="checkbox"
                        checked={selectedPlatforms.kick_start}
                        onChange={handleInputChange} />
                    Kick Start
                    </label>
                    <br />                
                    
                    <label>
                    <input
                        name="top_coder"
                        type="checkbox"
                        checked={selectedPlatforms.top_coder}
                        onChange={handleInputChange} />
                    TopCoder
                    </label>
                    <br />                
                    
                    <label>
                    <input
                        name="at_coder"
                        type="checkbox"
                        checked={selectedPlatforms.at_coder}
                        onChange={handleInputChange} />
                    AtCoder
                    </label>
                    <br />  

                    <label>
                    <input
                        name="cs_academy"
                        type="checkbox"
                        checked={selectedPlatforms.cs_academy}
                        onChange={handleInputChange} />
                    CS Academy
                    </label>
                    <br />

                    <label>
                    <input
                        name="showRemCont"
                        type="checkbox"
                        checked={showRemContestsOnly}
                        onChange={handleShowRemContCHnage} />
                    Reminder Added Contests
                    </label>
                    <br />
                </form>

            </div>

            <p>Time choose</p>

            <label>
                Lower bound:
            <input type="date" name="lower" onChange={timeChangeHandler} />
            </label>
            <label>
                Upper bound:
            <input type="date" name="upper" onChange={timeChangeHandler} />
            </label>


            <hr/>
            <p>All contests</p>
            {showAllContests}
            
            
            <hr/>


        </div>
    )
}



export default Scheduler;