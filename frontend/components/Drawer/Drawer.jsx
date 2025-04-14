import { Box, Drawer, Typography, Divider, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import DrawerNavList from "../Navigation/DrawerNavList";

const DrawerComponent = ({ open, handleDrawerToggle})=>{

    const drawerWidth = 240;
    const theme = useTheme();

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            
            <Typography variant="h6" sx={{ my: 2 }}>
                Code Buddy
            </Typography>
            
            <Divider />

            <DrawerNavList />

          {/* <List>
            {allPages.map((page) => (

              <ListItem key={page.name} disablePadding>
                <ListItemButton 
                    sx={{ textAlign: 'center' }}
                    onClick={() => {
                        // You can navigate using the page.path here
                        console.log(`Clicked ${page.name}`);
                    }}
                >
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>

            ))}
          </List> */}
        </Box>
    );


    return (
        <nav>
            <Drawer
                variant="temporary"
                open= {open}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    zIndex: theme.zIndex.drawer + 2,
                    display: { xs: 'block', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}>
                {drawer}
            </Drawer>   
        </nav>
    )
}

export default DrawerComponent;