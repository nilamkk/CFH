import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';

import { useTheme } from '@mui/material/styles';

const AppBarComp = ({ handleDrawerToggle }) => {

    const theme = useTheme();

    return (
        <AppBar position="sticky"  sx={{ zIndex: theme.zIndex.drawer + 1 }} >
            <Toolbar>
                
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 1 }}>
                    <MenuIcon />
                </IconButton>
                
                <Typography variant="h6">
                    Code Buddy
                </Typography>                        
            
            </Toolbar>
        </AppBar>
    )
}

export default AppBarComp;