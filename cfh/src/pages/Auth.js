import { useState,useRef,useContext } from "react";
import { useHistory } from "react-router";

import Input from "../components/Inputs/Input";
import Button from "../components/Buttons/Button";
import AuthContext from "../store/auth-context";

const Auth=(props)=>{

    const [logInBtn,setlogInBtn]= useState(true)

    const emailRef=useRef(null)
    const passwordRef=useRef(null)
    const handleRef=useRef(null)


    const authCntx=useContext(AuthContext)
    const history=useHistory()

    const changeLoginBtnHandler=()=>{
        setlogInBtn( !logInBtn )
    }   

    const submitHandler=async (event)=>{
        event.preventDefault()
        const emailIp=emailRef.current.value
        const passwordIp=passwordRef.current.value
        let handleIp=null
        const apiKey=process.env.FIREBASE_API_KEY
        let  url=""

        if(!logInBtn){  // signup 
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
        }else{         // login url
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
        }

        try{
            const result= await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email:emailIp,
                    password:passwordIp,
                    returnSecureToken:true
                })
            })  
            const parsedRes= await result.json()
            if(!result.ok){
                throw new Error(parsedRes.error.message)
            }
            /////////////////////////////////////////////////////////////////////////////////////////////// errorrrrrrrrrrr
            if(!logInBtn){
                //signup
                handleIp=handleRef.current.value
                const user=await fetch('/create-user',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        Handle:handleIp,
                        LocalId:parsedRes.localId
                    })
                })
                const parsedUser=await user.json()
                if(!user.ok){
                    throw new Error(parsedUser.error.message) ///////////////////////////////////////////// not sure abouy error msg
                }
            }else{
                //login
                const Handle=await fetch('/get-handle',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        LocalId:parsedRes.localId
                    })
                })
                console.log("I am here 1")
                const parserHandle=await Handle.json()
                if(!Handle.ok){
                    throw new Error(parserHandle.error.message) ///////////////////////////////////////////// not sure abouy error msg
                }
                handleIp=parserHandle.Handle
                console.log(handleIp)   
            }

            authCntx.login(parsedRes.idToken,parsedRes.email,parsedRes.expiresIn,parsedRes.localId,handleIp)
            history.push("/profile")
        }catch(error){
            // have to show error to the user
            alert(error)
            console.log(error)
        }
    }

    return(
        <div>
            <form onSubmit={submitHandler}>
                {logInBtn?null:<Input htmlFor="text" type="text" Label="Your CF Handle"  refer={handleRef}/>}
                <Input htmlFor="email" type="email" Label="Your Email"  refer={emailRef}/>
                <Input htmlFor="password" type="password" Label="Your Password" refer={passwordRef} />
                <div>
                    <Button type="submit">{logInBtn?"Log in":"Create an account"}</Button>
                </div>
            </form>
            <div>
                <Button type="button" clickHandler={changeLoginBtnHandler}>{logInBtn?"Create an account":"Log in"}</Button>
            </div>
        </div>
    )
}

export default Auth;