import {NavLink} from 'react-router-dom'

const NavElement =(props)=>{
    return(
        <NavLink
            to={props.moveTo}
            exact
            activeClassName="my-active"
            className={props.classNameToAdd}
            >
            {props.children}
            
        </NavLink>
    )
}

export default NavElement;
