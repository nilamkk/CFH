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

                <div style={{
                    padding: '2em'
                }}>
                    <Card header={"Problem-rating pie chart"}>
                        <PieChart handle={authCntx.Handle} getData={getProblemsRating}  />
                    </Card>
                </div>

                <div style={{
                    padding: '2em'
                }}>
                    <Card header={"Submission pie chart"}>
                        <PieChart handle={authCntx.Handle} getData={getSubmissionPie}  />
                    </Card>   
                </div>         


                <div style={{
                    padding: '2em'
                }}>
                    <Card header={"Languages pie chart"}>
                        <PieChart handle={authCntx.Handle} getData={getLanguagesUsedPie} />
                    </Card>
                </div>     


                <div style={{
                    padding: '2em'
                }}>
                    <Card header={"Rating Wise Count of Accepted Questions"}>
                        <BarChart handle={authCntx.Handle} getData={getProblemsRating} />
                    </Card>   
                </div>  


                <div style={{
                    padding: '2em'
                }}>
                    <Card header={"Rated Participated Contests"}>
                        <CfRatingGraph handle={authCntx.Handle} getData={getContestRating}/>
                    </Card>
                </div>          
            </div> 
        )
    }

    return(
        <div>
            {profile_contents}
        </div>
    )
}



export default Profile;