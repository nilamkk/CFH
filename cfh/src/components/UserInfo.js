// Canvasjs chart
import React,{Component} from 'react';
import axios from 'axios'
// import path from 'path'


class User extends Component{
  // for the time being I will do all with component state, but I have to convert all to redux
  state={
    userData:null
  }
  async componentDidMount(){
    if(this.state.userData)
        return;
    try{
        const data=await axios.get('/user-profile')
        this.setState({
            userData:data.data
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
                    <img src={this.state.userData.photo}/>
                    <p>First Name:{this.state.userData.firstName}</p>
                    <p>Last Name:{this.state.userData.lastName}</p>
                    <p>Last online:{this.state.userData.lastVisit}</p>
                    <p>Country :{this.state.userData.country}</p>
                    <p>City :{this.state.userData.city}</p>
                    <p>Rating :{this.state.userData.rating}</p>
                    <p>Max rating:{this.state.userData.maxRating}</p>
                    <p>Handle :{this.state.userData.handle}</p>
                    <p>Rank:{this.state.userData.category}</p>
                    <p>Best rank:{this.state.userData.maxCategory}</p>
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
