import { Route} from 'react-router-dom';
import Auth from '../Auth'

import './Homepage.css'

const Home=(props)=>{
    return(
        // container div
        <div className="text-alignment-centre" >
            
            {props.isAuthenticated? <p className="text-gray">Logged in successfully!!!</p> : <p className="text-gray">Log in or Sign up to see the features!!! </p>}
            <Route path='/home/auth' >      <Auth />          </Route>

        </div>
    )
}



export default Home;