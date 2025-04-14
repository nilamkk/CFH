// React
import { useState } from "react";
// MUI
import { Box } from "@mui/material";

// Components
import AppBarComp from "../AppBar/AppBar";
import DrawerComponent from "../Drawer/Drawer";


const Layout=(props)=>{

    const [openDrawer, setOpenDrawer] = useState(false);

    const handleDrawerToggle = () => setOpenDrawer((prevState) => !prevState);

    return (
        <Box>
            
            <AppBarComp handleDrawerToggle = { handleDrawerToggle } />
            
            <DrawerComponent open = { openDrawer }  handleDrawerToggle = { handleDrawerToggle } />

            {props.children}
        
        </Box>
    )
}

export default Layout;