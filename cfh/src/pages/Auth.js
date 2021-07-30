import { useState,useRef,useContext } from "react";
import { useHistory } from "react-router";

import AuthContext from "../store/auth-context";
import isEmail from 'validator/lib/isEmail';
const Auth=(props)=>{

    const [logInBtn,setlogInBtn]= useState(true)
    const [forgotPwState,setForgotPwState]=useState(false)
    const [errorMessage, setErrorMessage]=useState(null)
    const [successMessage,setSuccessMessage]=useState(null)

    const emailRef=useRef(null)
    const passwordRef=useRef(null)
    const confirmPwRef=useRef(null)
    const handleRef=useRef(null)
    // const sendPwEmailRef=useRef(null)

    const authCntx=useContext(AuthContext)
    const history=useHistory()

    const changeLoginBtnHandler=()=>{
        setForgotPwState(false)
        setErrorMessage(null)
        setSuccessMessage(null)
        setlogInBtn( state=>!state )
    }   

    const forgotPwHandler=(e)=>{
        e.stopPropagation()
        setForgotPwState(true)
    }

    const forgotPassword=async(e)=>{
        e.preventDefault()
        // console.log("clicked!!!")
        const email= emailRef.current.value.trim()
        try{
            const res= await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    requestType:"PASSWORD_RESET",
                    email:email
                })
            })
            const parsedRes= await res.json()
            // console.log(parsedRes.error.errors[0].message)            
            if( !res.ok ){
                throw new Error(parsedRes.error.errors[0].message)
            }
            setSuccessMessage("Email sent successfully!!!")
            setErrorMessage(null)
        }catch(error){  
            // show the error message
            setErrorMessage(error.message)
            setSuccessMessage(null)
            // console.log(error.message)
        }

    }

    const submitHandler=async (event)=>{
        event.preventDefault()
        let confirmPw=null
        const emailIp=emailRef.current.value.trim()
        const passwordIp=passwordRef.current.value.trim()
        let handleIp=null

        if(!logInBtn){
            // signup--> check if both passwords same
            confirmPw= confirmPwRef.current.value.trim()

            if(confirmPw!==passwordIp){
                console.log("Passwords do not match!!!")
                setErrorMessage("Passwords do not match!!!")
                setSuccessMessage(null)
                return
            }
        }
        // for both sign up and sign in--> check if the email is valid
        if(!isEmail(emailIp)){
            setErrorMessage("Please provide valid email !!!")
            setSuccessMessage(null)
            return;  
        }

        const apiKey=process.env.REACT_APP_FIREBASE_API_KEY//process.env.FIREBASE_API_KEY
        let  url=""


        if(!logInBtn){  // signup 
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
        }else{         // login url
            url=`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
        }

        try{

            // check if it is sign up then Hnadle exist
            if(!logInBtn){
                // sign up
                handleIp= handleRef.current.value.trim()
                // check if it exist
                const handleValRes= await fetch(`https://codeforces.com/api/user.info?handles=${handleIp}`)

                const parsedHandleValRes= await handleValRes.json()

                if(!handleValRes.ok){
                    if(handleValRes.statusText){
                        throw new Error(handleValRes.statusText)   /// fectch style but not always
                    }else{
                        throw new Error(parsedHandleValRes.comment)   ///// CF style
                    }
                }
            }
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
                if(result.statusText)
                    throw new Error(result.statusText)
                throw new Error(parsedRes.error.message)  // fire base error syntax
            }
            if(!logInBtn){
                //signup
                handleIp=handleRef.current.value.trim()
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
                    if(user.statusText)
                        throw new Error(user.statusText)
                    
                    throw new Error(parsedUser.error.message) ////////////// najanu 
                }
            }else{
                //login
                console.log("getting handle")                    //////////////////////////////// ONLY THIS IS LEFT TO HANDLE
                const Handle=await fetch('/get-handle',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        LocalId:parsedRes.localId
                    })
                })
                if(!Handle.ok){
                    throw new Error(Handle.statusText)  // internal server error 
                }
                const parserHandle=await Handle.json()

                handleIp=parserHandle.Handle
            }
            let exactExpireTime= new Date().getTime() + parsedRes.expiresIn*1000 
            localStorage.setItem('cb_user',parsedRes.idToken) 
            localStorage.setItem('cb_user_mail',parsedRes.email)
            localStorage.setItem('cb_user_expiresIn',exactExpireTime) // storing expire point of time in mili sec
            localStorage.setItem('cb_user_localId',parsedRes.localId)
            localStorage.setItem('cb_user_handleIp',handleIp)

            authCntx.login(parsedRes.idToken,parsedRes.email,parsedRes.expiresIn,parsedRes.localId,handleIp)
            history.push("/profile")
        }catch(error){
            setSuccessMessage(null)
            setErrorMessage(error.message)
            console.log(error.message)
        }
    }

    return(
        <div className="log-sign-container">

            <form onSubmit={ !forgotPwState? submitHandler : forgotPassword} className="log-sign-form">

                <h2 className="text-primary">{ forgotPwState?"Forgot Password":(logInBtn?"Log In":"Sign Up")}</h2>

                {
                forgotPwState?null:
                (logInBtn?null:(
                <div className="log-sign-form-group">
                    <input type="text" placeholder="CF Handle" ref={handleRef} required/>
                </div>
                ))}

                {
                    !forgotPwState?null:(
                    <div className="log-sign-form-group" >
                        <p className="log-sign-form-group-para"> Enter the registered email address. We will send a link to change the password to that mail. </p>
                    </div>  
                    )

                }

              

                <div className="log-sign-form-group">
                    <input type="email" placeholder="Email" ref={emailRef} required/>
                </div>
                
                {forgotPwState?null:(
                <div className="log-sign-form-group">
                    <input type="password" placeholder="Password" ref={passwordRef} required/>
                </div>
                )}

                
                {
                forgotPwState?null:  
                (logInBtn?null:(
                <div className="log-sign-form-group">
                    <input type="password" placeholder="Confirm password" ref={confirmPwRef} required/>
                </div>
                ))}

                {/* <Input htmlFor="password" type="password" Label="Your Password" refer={passwordRef} /> */}

                <div className="log-sign-form-group">
                    <button type="submit" > {  forgotPwState?"Send": (logInBtn?"Log in":"Create an account") } </button>
                    {/* <Button type="submit">{logInBtn?"Log in":"Create an account"}</Button> */}
                </div>
                
                {
                    forgotPwState?null:(
                    <div className="log-sign-form-group" >
                        <span onClick={forgotPwHandler} >Forgot Password?</span>
                    </div>
                    )
                }
                
                {
                    !errorMessage?null:
                    (<div className="log-sign-form-group" >
                        <span style={{color:"red"}} >{errorMessage}</span>
                    </div>)
                }
                {
                    !successMessage?null:
                    (<div className="log-sign-form-group" >
                        <span style={{color:"green"}} >{successMessage}</span>
                    </div>)
                }

            </form>
            {/* { */}
                {/* forgotPwState?null:( */}
                    <p > <span onClick={changeLoginBtnHandler}> {logInBtn?"Create an account":"Already have an account"} </span> </p>
                {/* ) */}
            {/* } */}

        </div>
    )
}

export default Auth;