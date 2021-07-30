import React,{Component,Fragment} from 'react';
import ImageCard from './UI/Card/user-image-card';
import UserGenInfo from '../components/UI/Card/user-gen-info'


import './User-info.css'
import '../components/Spinner/Spinner.css'
import Spinner from './Spinner/Spinner';

class User extends Component{
    state={
        userData:null,
        userData2:null,
        loading:false,
        error:null
    }
    async componentDidMount(){
        if(this.state.userData || this.state.error)
            return;
        
        this.setState({         
            loading:true
        })

        let url=`https://codeforces.com/api/user.info?handles=${this.props.handle}${this.props.handle2?(";"+this.props.handle2):""}`

        try{
            const res= await fetch(url)
            let parsedRes;
            console.log("here1")
            if(!res.ok){
                if(res.statusText){
                    throw new Error(res.statusText)  // fetch error
                }
                parsedRes= await res.json()
                throw new Error(parsedRes.comment)   // CF error
            }
            parsedRes= await res.json()
            console.log("here2")

            this.setState({
                userData:parsedRes.result[0],
                userData2:parsedRes.result[1],
                loading:false,
                error:null
            })    
        }catch(error){
            this.setState({
                loading:false,
                error:error.message
            })
            
            console.log(error.message)
        }
    }

    render() {
        let userProfile

        if(!this.state.userData ){
            if(this.state.error)
                userProfile=<p>{this.state.error}</p>
            else// loading
                userProfile=(
                    <Fragment>
                    <div className="user-info-container-flex">
                        <Spinner/>
                        <Spinner/>
                    </div>
                </Fragment>
                )
        }else{
            if(!this.state.userData2){
                userProfile=(
                    <Fragment>
                        <div className="user-info-container-flex">
                            <ImageCard 
                                titlePhoto={this.state.userData.titlePhoto} 
                                firstName={this.state.userData.firstName} 
                                lastName={this.state.userData.lastName}  
                                country={this.state.userData.country}
                                city={this.state.userData.city}/>
    
                            <UserGenInfo userData={this.state.userData}/>
                        </div>
                    </Fragment>
                )
            }else{
                userProfile=(
                    <Fragment>
                        <div className="user-info-container-flex">
                                <ImageCard 
                                    titlePhoto={this.state.userData.titlePhoto} 
                                    firstName={this.state.userData.firstName} 
                                    lastName={this.state.userData.lastName}  
                                    country={this.state.userData.country}
                                    city={this.state.userData.city}
                                    twoUsers={true}/>
                                <ImageCard 
                                    titlePhoto={this.state.userData2.titlePhoto} 
                                    firstName={this.state.userData2.firstName} 
                                    lastName={this.state.userData2.lastName}  
                                    country={this.state.userData2.country}
                                    city={this.state.userData2.city}
                                    twoUsers={true}/>
                        </div>
                        <div className="user-info-container-flex">
                            <UserGenInfo userData={this.state.userData} twoUsers={true}/>
                            <UserGenInfo userData={this.state.userData2} twoUsers={true} />
                        </div>

                    </Fragment>
                )
            }


        }
        return (
            <div>
                {userProfile}
            </div>
        );
    }
    
}


export default User;
