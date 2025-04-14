import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import NavElement from './NavElement';
import allPages from '../../pages/AllPages.json' with { type: 'json' };

const DrawerNavList = () => {
    return (
        <>
            <List>
                {allPages.map((page) => (

                    <NavElement moveTo={page.path} key = {page.path} >

                        <ListItem key={page.name} disablePadding>
                            <ListItemButton
                                sx={{
                                    textAlign: 'center'
                                }}
                            >
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        </ListItem>

                    </NavElement>
                ))}
            </List>
        </>
    )
}

export default DrawerNavList;