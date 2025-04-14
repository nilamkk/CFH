import { Routes, Route } from 'react-router-dom';
import ExperimentApp from "../components/ExperimentalComponent"
import CodeForcesProfilePage from "../components/Experiment/ProfileExp.jsx"

// Pages
import ProblemLists from '../pages/ProblemLists/ProblemLists.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import SignUp from '../pages/SignUp/SignUp.jsx';
// Components
import Layout from '../components/Layout/Layout.jsx';
import SearchProblems from '../pages/SearchProblems/SearchProblems.jsx';
import LogInComponent from '../pages/SignUp/LogIn.jsx';
import PrivateRoute from '../components/PrivateComponent.jsx';

function App() {
  return (
    <Layout>

      <Routes>
        
        <Route path='/experiment' element = { <ExperimentApp /> } />
        <Route path='/profile_exp' element = { <CodeForcesProfilePage /> } />    

        <Route path='/' element = { <ProblemLists /> } />
        <Route path='/contests' element = { <ProblemLists /> } />

        <Route path='/signup' element = { <SignUp /> } />
        <Route path='/login' element = { <LogInComponent /> } />
        <Route path='/profile' element = { <PrivateRoute  component = { Profile } /> } />
        <Route path='/search-problem' element = { <PrivateRoute  component = { SearchProblems } /> } />
        <Route path='/problem-lists' element = { <PrivateRoute  component = { ProblemLists } /> } />


        <Route path='/compare' element = { <ProblemLists /> } />
        <Route path='/about' element = { <ProblemLists /> } />
        <Route path='/contact' element = { <ProblemLists /> } />

      </Routes>

    </Layout>
  )
}

export default App;