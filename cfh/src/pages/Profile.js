import { useContext } from 'react'

import AuthContext from '../store/auth-context'
import PieChart from '../components/Charts/pieChart'
import BarChart from '../components/Charts/barChart'
import CfRatingGraph from '../components/Charts/cfRatingGraph'
import User from '../components/UserInfo'
import Card from '../components/UI/Card/card'
import {getProblemsRating,getSubmissionPie,getContestRating, getLanguagesUsedPie} from '../utils/profile'

const Profile=(props)=>{

    const authCntx=useContext(AuthContext)

    let profile_contents=null

    if(authCntx.Handle){
        profile_contents=(
            <div className="App-class">
                <User handle={authCntx.Handle} />
                
                <Card header={"Problem-rating pie chart"}>
                    <PieChart handle={"Um_nik"} getData={getProblemsRating}  />
                </Card>
                
                <Card header={"Submission pie chart"}>
                    <PieChart handle={"Um_nik"} getData={getSubmissionPie}  />
                </Card>                
                
                <Card header={"Languages pie chart"}>
                    <PieChart handle={"Um_nik"} getData={getLanguagesUsedPie} />
                </Card>
                
                <Card header={"Rating Wise Count of Accepted Questions"}>
                    <BarChart handle={"Um_nik"} getData={getProblemsRating} />
                </Card>                
                
                <Card header={"Rated Participated Contests"}>
                    <CfRatingGraph handle={"Um_nik"} getData={getContestRating}/>
                </Card>
                
                
            </div> 
        )
    }

    return(
        <div>
            Hello I am Profile
            {profile_contents}
        </div>
    )
}



export default Profile;