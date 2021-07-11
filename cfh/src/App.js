import React,{useContext} from 'react'
import { Switch, Route ,Redirect} from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/Homepage/Homepage'
import Profile from './pages/Profile'
import Scheduler from './pages/Scheduler/Scheduler'
import OldProblems from './pages/oldProblems/OldProblems'
import Compare from './pages/Compare'
import AuthContext from '../src/store/auth-context'

import './App.css';

const App=(props)=>{

  const authCntx=useContext(AuthContext)

  let isAuthenticated= !(authCntx.idToken===null)

  return(
    <Layout >

      <Switch>

        {isAuthenticated? <Route path='/profile'>      <Profile/>         </Route> : null }
        {isAuthenticated? <Route path='/scheduler'>     <Scheduler />     </Route> : null }
        {isAuthenticated? <Route path='/oldProblems'>     <OldProblems /> </Route> : null }
        {isAuthenticated? <Route path='/compare'>     <Compare />       </Route>   : null }

        <Route path='/home' >      <HomePage isAuthenticated={isAuthenticated} />          </Route>

        <Redirect from="/" to="/home" />

      </Switch>          

    </Layout>
  )
}

export default App;