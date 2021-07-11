import React,{Component} from 'react';
import ImageCard from './UI/Card/user-image-card';


class User extends Component{
  // for the time being I will do all with component state, but I have to convert all to redux
    state={
        userData:null
    }
    async componentDidMount(){
        if(this.state.userData)
            return;
        try{
            const res= await fetch(`https://codeforces.com/api/user.info?handles=${this.props.handle}`)
            const parsedRes= await res.json()
            if(!res.ok){
                throw new Error(parsedRes.comment)
            }
            this.setState({
                userData:parsedRes.result[0]
            })    
        }catch(error){
            console.log(error)
        }
    }

    render() {
        let userProfile
        if(!this.state.userData){
            userProfile="<Spinner/>"
        }else{
            userProfile=(
                <div>
                    <ImageCard 
                        titlePhoto={this.state.userData.titlePhoto} 
                        firstName={this.state.userData.firstName} 
                        lastName={this.state.userData.lastName}  
                        country={this.state.userData.country}
                        city={this.state.userData.city}/>

                    {/* <img src={this.state.userData.titlePhoto} alt="User Image"/> */}
                    {/* <p> First Name:{this.state.userData.firstName? this.state.userData.firstName :"Not available"  }</p>
                    <p> Last Name:{this.state.userData.lastName ?this.state.userData.lastName:"Not available"  }</p> */}
                    <p> Last online:{this.state.userData.lastOnlineTimeSeconds?  this.state.userData.lastOnlineTimeSeconds:  "Not available"  }</p>
                    {/* <p> Country :{this.state.userData.country?this.state.userData.country:"Not available"}</p> */}
                    {/* <p> City :{this.state.userData.city?this.state.userData.city:"Not available"}</p> */}
                    <p> Rating :{this.state.userData.rating?this.state.userData.rating:"Not available"}</p>
                    <p> Max rating:{this.state.userData.maxRating?this.state.userData.maxRating:"Not available"}</p>
                    <p> Handle :{this.state.userData.handle?this.state.userData.handle:"Not available"}</p>
                    <p> Rank:{this.state.userData.rank?this.state.userData.rank:"Not available"}</p>
                    <p> Best rank:{this.state.userData.maxRank?this.state.userData.maxRank:"Not available"}</p>
                </div>
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
