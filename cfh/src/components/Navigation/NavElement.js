import {NavLink} from 'react-router-dom'

const NavElement =(props)=>{
    return(
        <NavLink
            to={props.moveTo}
            exact
            activeClassName="my-active">
            {props.children}
        </NavLink>
    )
}

export default NavElement;
