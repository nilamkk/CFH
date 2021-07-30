import React,{useContext,useEffect} from 'react'
import { Switch, Route ,Redirect} from 'react-router-dom';
import { useHistory } from 'react-router';

import Layout from './components/Layout/Layout';
import HomePage from './pages/Homepage/Homepage'
import Profile from './pages/Profile'
import Scheduler from './pages/Scheduler/Scheduler'
import OldProblems from './pages/oldProblems/OldProblems'
import Compare from './pages/Compare'
import AuthContext from '../src/store/auth-context'

// import './App.css';

const App=(props)=>{

  const authCntx=useContext(AuthContext)
  const history= useHistory()

  useEffect(()=>{
    let userId= localStorage.getItem('cb_user')
    let email= localStorage.getItem('cb_user_mail')
    let expiresIn= localStorage.getItem('cb_user_expiresIn')
    let localId= localStorage.getItem('cb_user_localId')
    let handleIp= localStorage.getItem('cb_user_handleIp')

    if(userId && email && expiresIn && localId && handleIp &&  (new Date().getTime() <= expiresIn) ){
      authCntx.login(userId,email,expiresIn,localId,handleIp)
      history.push('/profile')
    }else{
      localStorage.removeItem('cb_user')
      localStorage.removeItem('cb_user_mail')
      localStorage.removeItem('cb_user_expiresIn')
      localStorage.removeItem('cb_user_localId')
      localStorage.removeItem('cb_user_handleIp')
    }
  },[])

  let isAuthenticated= !(authCntx.idToken===null)

  return(
    <Layout >

      <Switch>

        {isAuthenticated? <Route path='/profile'>      <Profile/>         </Route> : null }
        {isAuthenticated? <Route path='/scheduler'>     <Scheduler />     </Route> : null }
        {isAuthenticated? <Route path='/oldProblems'>     <OldProblems /> </Route> : null }
        {isAuthenticated? <Route path='/compare'>     <Compare />       </Route>   : null }

        <Route path='/home' >      <HomePage isAuthenticated={isAuthenticated} />          </Route>

        <Redirect from="/" to="/home/auth" />

      </Switch>          

    </Layout>
  )
}

export default App;