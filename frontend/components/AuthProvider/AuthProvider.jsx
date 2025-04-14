// AuthContext.js
import { use, useEffect } from 'react';
import { createContext, useContext, useState } from 'react';

import {handleBackendError} from '../../src/utils/UtilityFunctions.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [cfhandle, setCfhandle] = useState(null);

    // use effect to check if token is in local storage
    useEffect(() => {
        const getCFHandle = async (token) => {
            try {
                const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/cfhandle`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.statusText)
                        throw new Error(response.statusText);
                    const parsedRes = await response.json();
                    throw new Error(parsedRes.error.message);
                }

                //////////////////// Errors? ////////////////////
                /////////////////////////////////////////////////

                const cfhandleInfo = await response.json(); // {handle} 
                return cfhandleInfo;
            } catch (err) {
                console.error('CF Handle fetch failed:', err);
                return err;
            }
        };

        const token = getTokenFromLocalStorage();
        if (token) {
            getCFHandle(token).then((cfhandleInfo) => {
                if (cfhandleInfo.error) {
                    console.error('CF Handle fetch failed:', cfhandleInfo);
                } else {
                    setCfhandle(cfhandleInfo.handle);
                    setToken(token);
                }
            });
        }
    }, []);

    const signup = async (handle, email, password) => {
        try {
            const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/signup`;
            const payload = {
                handle: handle,
                email: email,
                password: password
            };
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json'}
            });

            await handleBackendError(response); 
            // if no error then the below
            const signupInfo = await response.json(); // {userId, handle, email, token} 
            setToken(signupInfo.token);
            setCfhandle(signupInfo.handle);
            setTokenToLocalStorage(signupInfo.token);
            return signupInfo;
        } catch (err) {
            // this block will get executed for errors like no internet connection, DNS resultion fail,
            // server unreachable, CORS etc. fetch will reject the promise only for these errors
            // for other status code error this will not get executed
            return { error: err };
        }
    }

    const login = async (email, password) => {

        try {
            const url = `${import.meta.env.VITE_CODE_BUDDY_BACKEND_API_BASE_URL}/login`;
            const payload = {
                email: email,
                password: password
            }
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {'Content-Type': 'application/json'}
            });
            
            if (!response.ok) {
                if (response.statusText)
                    throw new Error(response.statusText);
                const parsedRes = await response.json();
                throw new Error(parsedRes.error.message);
            }

            //////////////////// Errors? ////////////////////
            /////////////////////////////////////////////////

            const loginInfo = await response.json(); // {userId, handle, email, token} 

            setToken(loginInfo.user.token);
            setCfhandle(loginInfo.user.handle);
            setTokenToLocalStorage(loginInfo.user.token);

            console.log('Login successful:', loginInfo);

            return loginInfo;
        } catch (err) {
            console.error('Login failed:', err);
            return {error: err};
        }
    };

    const logout = () => {
        setToken(null);
        setCfhandle(null);
        removeTokenFromLocalStorage();
    };

    const getTokenFromLocalStorage = () => {
        return localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
    }
    const setTokenToLocalStorage = (token) => {
        // localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, token);
    }
    const removeTokenFromLocalStorage = () => {
        localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
    }

    return (
        <AuthContext.Provider value={{ token, cfhandle, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
