import {NavLink} from 'react-router-dom'

///////////////////////////////////////////////
// use theme and style this nav element
// center alignment of the texts
// current active link highlight
// import { styled } from '@mui/material/styles';

// const StyledNavLink = styled(NavLink)(({ theme }) => ({
//   textDecoration: 'none',
//   color: 'inherit',
//   '& .MuiListItemButton-root': {
//     textAlign: 'center',
//     '&.active': {
//       backgroundColor: theme.palette.action.selected,
//       '& .MuiListItemText-primary': {
//         color: theme.palette.primary.main,
//         fontWeight: 'bold'
//       }
//     }
//   }
// }));


const NavElement =({moveTo, isActive, children})=>{
    return(
        <NavLink
            to={moveTo}
            style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: isActive ? 'bold' : 'normal'
                // color: isActive ? 'blue' : 'black'
            }}
        >
            {children}
        </NavLink>
    )
}

export default NavElement;