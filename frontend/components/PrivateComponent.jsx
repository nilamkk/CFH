import React from 'react';
import { Route } from 'react-router-dom';

import { useAuth } from './AuthProvider/AuthProvider';
import { Typography } from '@mui/material';

const PrivateRoute = ({ component: Component}) => {
    const { token: authToken } = useAuth();
    const isAuthenticated = !!authToken;

    if(  !isAuthenticated ){
        return (
            <Typography variant="h6" color="error">
                You need to login to access this page
            </Typography>
        );
    }

    return ( <Component  /> );
};

export default PrivateRoute;