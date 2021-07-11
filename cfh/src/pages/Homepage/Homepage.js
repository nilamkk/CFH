import { Route} from 'react-router-dom';
import Auth from '../Auth'

import './Homepage.css'

const Home=(props)=>{
    return(
        <div className="text-alignment-centre" >
            
            {props.isAuthenticated? <p>Hello I am Home! Have fun! Authenticated!</p> : <p>Seems like you have not logged in/ sign up yet</p>}
            <Route path='/home/auth' >      <Auth />          </Route>

        </div>
    )
}



export default Home;