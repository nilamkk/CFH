import { useContext } from "react";
import { useHistory } from "react-router";

import NavElement from "./NavElement"
import AuthContext from "../../store/auth-context";
import Button from "../Buttons/Button";

const MainNav=(props)=>{

    const authCntx=useContext(AuthContext)
    const history=useHistory()

    const clickHandler=()=>{
        console.log("You are logged out!")
        authCntx.logout()
        history.push('/home/auth')

    }

    return(
        <header>
            <h1>This is the CF helper</h1>
            <nav>
                <ul>
                    <li> <NavElement moveTo="/profile"> Profile   </NavElement > </li>
                    <li> <NavElement moveTo="/scheduler"> Scheduler </NavElement ></li>
                    <li> <NavElement moveTo="/oldProblems"> Old Problems  </NavElement ></li>
                    <li> <NavElement moveTo="/compare"> Compare</NavElement > </li>
                    {!authCntx.isLoggedIn?<li> <NavElement moveTo="/home/auth"> Log in </NavElement > </li> :null}
                    {authCntx.isLoggedIn?<li> <Button clickHandler={clickHandler}> Log out </Button > </li> :null}
                </ul>
            </nav>
        </header>
    )
}

export default MainNav;