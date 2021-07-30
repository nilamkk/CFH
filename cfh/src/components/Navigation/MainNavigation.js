import { useContext } from "react";
import { useHistory } from "react-router";

import NavElement from "./NavElement"
import AuthContext from "../../store/auth-context";
import Button from "../Buttons/Button";

import '../Layout/Layout'

const MainNav=(props)=>{

    const authCntx=useContext(AuthContext)
    const history=useHistory()

    const clickHandler=()=>{
        console.log("You are logged out!")
        authCntx.logout()
        history.push('/home/auth')

    }

    return(

        <div className={  props.slideBarExpanded===false ?"side-nav-bar-collapse":"side-nav-bar"}>

            <div className={props.slideBarExpanded===false?"side-nav-bar-collapse-it":""}>
                <ul className="slide-nav-bar-list">
                    <li>
                        <NavElement moveTo="/profile" classNameToAdd="list-link"> <span>Profile</span>  </NavElement >
                    </li>
                    <hr className="side-divider"/>
                    
                    <li>
                        <NavElement moveTo="/scheduler" classNameToAdd="list-link"> <span>Scheduler</span>  </NavElement >
                    </li>
                    <hr className="side-divider"/>
                    
                    <li>
                        <NavElement moveTo="/oldProblems" classNameToAdd="list-link"> <span>Old Problems</span>  </NavElement >
                    </li>
                    <hr className="side-divider"/>

                    <li>
                        <NavElement moveTo="/compare" classNameToAdd="list-link"> <span>Compare</span>  </NavElement >
                    </li>
                    <hr className="side-divider"/>

                    {!authCntx.isLoggedIn?<li> <NavElement moveTo="/home/auth" classNameToAdd="list-link" colorName={"white"}> <span>Log in</span>  </NavElement > </li> :null}
                    {!authCntx.isLoggedIn? <hr className="side-divider"/>  :null}

                    {authCntx.isLoggedIn?<li> <Button clickHandler={clickHandler} classNameToAdd="list-link" colorName={"white"}> <span>Log out </span> </Button > </li> :null}
                    {authCntx.isLoggedIn?<hr className="side-divider"/>  :null   }
                    
            
                </ul>
            </div>
        </div>
    )
}

export default MainNav;