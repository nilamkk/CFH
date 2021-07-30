import './user-gen-info.css'
import UserInfoRow from './user-info-row'

import {getTimeFormat} from '../../../utils/functions'


const UserGenInfo=props=>{

    let mainContainerDivClasses="card-user-gen-info"

    if(props.twoUsers===true){
        mainContainerDivClasses+=" card-body-user-gen-info-fifty"
    }

    return (

        <div className={mainContainerDivClasses}>


            <div className="card-body-user-gen-info">

                <UserInfoRow Attribute={"Handle"} Value={props.userData.handle?props.userData.handle:"Not available"} />
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Rank"} Value={props.userData.rank?props.userData.rank:"Not available"} />
                <hr className="hr-user-gen-info"/>
                
                <UserInfoRow Attribute={"Best rank"} Value={props.userData.maxRank?props.userData.maxRank:"Not available"} />
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Rating"} Value={props.userData.rating?props.userData.rating:"Not available"} />
                <hr className="hr-user-gen-info"/>                

                <UserInfoRow Attribute={"Max rating"} Value={props.userData.maxRating?props.userData.maxRating:"Not available"} />
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Last online"} Value={props.userData.lastOnlineTimeSeconds?getTimeFormat(props.userData.lastOnlineTimeSeconds):"Not available"} />
                <hr className="hr-user-gen-info"/>

            </div>
        </div>
    )
}

export default UserGenInfo;


