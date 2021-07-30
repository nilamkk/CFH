import React,{Component,Fragment} from 'react';
import ImageCard from '../UI/Card/user-image-card'                   //'./UI/Card/user-image-card';
import UserGenInfo from '../../components/UI/Card/user-gen-info'   //'../components/UI/Card/user-gen-info'

import '../User-info.css' // './User-info.css'

class User extends Component{
    // this.props.userData
    // this.props.userData2

    render() {
        let userProfile

        if(!this.props.userData2){
            userProfile=(
                <Fragment>
                    <div className="user-info-container-flex">
                        <ImageCard 
                            titlePhoto={this.props.userData.titlePhoto} 
                            firstName={this.props.userData.firstName} 
                            lastName={this.props.userData.lastName}  
                            country={this.props.userData.country}
                            city={this.props.userData.city}/>
                        <UserGenInfo userData={this.props.userData}/>
                    </div>
                </Fragment>
            )
        }else{
            userProfile=(
                <Fragment>
                    <div className="user-info-container-flex">
                            <ImageCard 
                                titlePhoto={this.props.userData.titlePhoto} 
                                firstName={this.props.userData.firstName} 
                                lastName={this.props.userData.lastName}  
                                country={this.props.userData.country}
                                city={this.props.userData.city}
                                twoUsers={true}/>
                            <ImageCard 
                                titlePhoto={this.props.userData2.titlePhoto} 
                                firstName={this.props.userData2.firstName} 
                                lastName={this.props.userData2.lastName}  
                                country={this.props.userData2.country}
                                city={this.props.userData2.city}
                                twoUsers={true}/>
                    </div>
                    <div className="user-info-container-flex">
                        <UserGenInfo userData={this.props.userData} twoUsers={true}/>
                        <UserGenInfo userData={this.props.userData2} twoUsers={true} />
                    </div>

                </Fragment>
            )
        }

        return (
            <div>
                {userProfile}
            </div>
        );
    }
    
}


export default User;
