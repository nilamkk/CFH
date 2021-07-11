import moment from 'moment'
import { Fragment,useState } from 'react'

import Modal from '../Modal/Modal'
import Button from '../Buttons/Button'
import ReminderModalContent from '../Modal/ModalContent/addReminderModalContent'
import './scheduler.css'
import {askNotificationPermission} from '../../utils/notificationFunctions'


const Contest=props=>{

    const [showModal,setShowModal]=useState(false)
    const [notiPermission,setNotiPermission]=useState(null)   //// used to decide modal content

    let contestInfo=props.contestInfo

    const showModalHandler=()=>{
        setShowModal(state=>true)
    }
    const removeModalHandler=()=>{
        setShowModal(state=>false)
    }
    const saveReminderToDB=async()=>{      
        // add reminder to db
        if( !(moment().add(70,'minutes')<= moment(contestInfo.start_time)) ){
            setNotiPermission("TooLate")
            showModalHandler()
            return;
        }
        try{
            const res=await fetch('/set-contest-reminder',{            
                method:"POST", 
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    LocalId:props.LocalId,
                    notification_time: moment(contestInfo.start_time).subtract(60,'minutes'),
                    ContestInfo:{
                        name:contestInfo.name,
                        site:contestInfo.site,
                        start_time:contestInfo.start_time
                    }
                })                                        
           })
           const parsedRes=await res.json()
           if(!res.ok){
               throw new Error(parsedRes.error.message)
           }
           // update the list of contests
           props.updateReminderStatusAfterRemAddition(parsedRes)

           // show added reminder modal
           setNotiPermission("ReminderAdded")
           showModalHandler()
        }catch(error){
            console.log(error)
        }


        console.log("Added !!!")
    }
    const setRemiBtnHandler=async ()=>{
        if( !(moment().add(70,'minutes')<= moment(contestInfo.start_time)) ){   
            setNotiPermission("TooLate")
            showModalHandler()
            return;
        }
        try{
            if("Notification" in window){
                // askPermission and create subscription
                await askNotificationPermission(props.LocalId)       

                if( Notification.permission==="default" ){
                    setNotiPermission("default")
                    showModalHandler()
                    console.log("Please enable notification using ENABLE NOTIFICATION !!!")
                    return;
                }else if(Notification.permission==="denied"){
                    setNotiPermission("denied")
                    showModalHandler()
                    console.log("Please enable notification using site setting!!!")
                    return;
                }
                // granted:  Now show the modal for confirmation
                setNotiPermission("granted")
                showModalHandler()
                console.log("Clicked !!!")
            }else{
                // NotAvailable
                setNotiPermission("NotAvailable")
                showModalHandler()
            }
        }catch(error){
            console.log(error)
        }
    }
    const removeRemiBtnHandler=()=>{
        setNotiPermission("reallyRemoveReminder?")
        showModalHandler()
    }
    const removeReminderFromDB=async()=>{
        try{
            let url=`/remove-user-reminder-contest`
            // req to remove reminder
            const result= await fetch(url,{            
                method:"POST", 
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    LocalId:props.LocalId,
                    notification_time: moment(contestInfo.start_time).subtract(60,'minutes'),
                    ContestInfo:{
                        name:contestInfo.name,
                        site:contestInfo.site,
                        start_time:contestInfo.start_time
                    }
                })                                        
            })

            const parsedRes=await result.json()
            if(!result.ok){
                throw new Error(parsedRes.error.message)
            }
            // then update the original list too
            props.updateReminderStatusAfterRemRemove(parsedRes)
            // set removed modal
            setNotiPermission("reminderRemoved")
            showModalHandler()
        
        }catch(error){
            console.log(error)
        }

    }

    // Setting modal content
    // default case
    let ModalContent=<ReminderModalContent 
                        content="Please enable notification using ENABLE NOTIFICATION !!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>

    if(notiPermission==="denied"){
        ModalContent=<ReminderModalContent 
                        content="Please enable notification using site setting!!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }else if(notiPermission==="granted"){
        ModalContent=<ReminderModalContent 
                        contestInfo={contestInfo}
                        starts_at={moment(contestInfo.start_time).format('Do MMMM YYYY, h:mm a')}
                        btnContent="set reminder"
                        clickHandler={saveReminderToDB}/>
    }else if(notiPermission==="NotAvailable"){
        ModalContent=<ReminderModalContent 
                        content="Sorry!! Notification is not available!!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }else if(notiPermission==="ReminderAdded"){
        ModalContent=<ReminderModalContent 
                        content="Reminder Added !!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }else if(notiPermission==="TooLate"){
        ModalContent=<ReminderModalContent 
                        content="You can add reminder only before atleast one hour!!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }else if(notiPermission==="reallyRemoveReminder?"){
        ModalContent=<ReminderModalContent 
                        content="Do you really want to remove reminder?"
                        btnContent="Remove"
                        clickHandler={removeReminderFromDB}/>
    }else if(notiPermission==="reminderRemoved"){
        ModalContent=<ReminderModalContent 
                        content="Reminder removed !!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }


    let SetRemiBtn=null
    // showing the btn only if atleast 1 hour is left to start
    if(contestInfo.reminderAdded===true){
        SetRemiBtn= <Button type="button" clickHandler={ removeRemiBtnHandler } Danger={true} >Remove reminder</Button>
    }else if( moment().add(70,'minutes')<= moment(contestInfo.start_time) ){
        SetRemiBtn= <Button type="button" clickHandler={setRemiBtnHandler} >Set Reminder Before 1 hr</Button>
    }

    return (

        <Fragment>
            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModalHandler}> {ModalContent} </Modal>  :null}

            <div className="contest-box"> 
                <p>Name: {contestInfo.name}</p>
                <p>URL: {contestInfo.url}</p>
                <p>Start time: {moment(contestInfo.start_time).format('Do MMMM YYYY, h:mm a') }</p>
                <p>Duration: {contestInfo.duration}</p>
                <p>Site: {contestInfo.site}</p>
                <p>In 24 hours: {contestInfo.in_24_hours}</p>

                {SetRemiBtn}

            </div>
        </Fragment>

    )
}


export default Contest;