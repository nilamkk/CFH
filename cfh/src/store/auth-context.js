// steps to use context api
// make context object using the initial state and use the provider component in it to wrap the components where we want to access the state.
// next we have to listen for that state to access it/change it. For this, we have auth context consumer or react hook.  


import React,{useState} from 'react'

const AuthContext= React.createContext({
    idToken:'',
    email:null,
    expiresIn:null,
    localId:null,
    isLoggedIn:false,
    Handle:null,

    login:()=>{},
    logout:()=>{}
})


export const AuthContextProvider=(props)=>{
    const [info,setInfo]=useState(null)
    
    const logInHandler=(token,email,expiresIn,localId,handle)=>{
        setInfo({
            idToken:token,
            email:email,
            expiresIn:expiresIn,
            localId:localId,
            isLoggedIn:true,
            Handle:handle
        })
    }

    const logOutHandler=()=>{
        setInfo(null)
    }

    const contextValue={
        idToken:info?info.idToken:null,
        email:info?info.email:null,
        expiresIn:info?info.expiresIn:null,
        localId:info?info.localId:null,
        isLoggedIn:info?info.isLoggedIn:false,
        Handle:info?info.Handle:null,

        login:logInHandler,
        logout:logOutHandler
    }


    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

