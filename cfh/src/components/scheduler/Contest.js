import moment from 'moment'
import { Fragment,useState } from 'react'

import Modal from '../Modal/Modal'
import Button from '../Buttons/Button'
import ReminderModalContent from '../Modal/ModalContent/addReminderModalContent'
import './scheduler.css'
import {askNotificationPermission} from '../../utils/notificationFunctions'
import {getDurationFormat} from '../../utils/functions'
import UserInfoRow from '../UI/Card/user-info-row'
import OpenSpinner from '../Spinner/OpenSpinner'

const Contest=props=>{

    const [showModal,setShowModal]=useState(false)
    const [notiPermission,setNotiPermission]=useState(null)   //// used to decide modal content
    const [showFullContestInfo,setShowFullContestInfo]= useState(false)
    const [loading,setLoading]= useState(false)

    let contestInfo=props.contestInfo

    const showModalHandler=()=>{
        setShowModal(state=>true)
    }
    const removeModalHandler=()=>{
        setShowModal(state=>false)
    }

    const saveReminderToDB=async()=>{      
        // add reminder to db
        // (new Date().getTime()+70*60*1000) <= (new Date(contestInfo.start_time).getTime())
        if( !(  moment().add(70,'minutes')<= moment(contestInfo.start_time)       ) ){
            setNotiPermission("TooLate")
            showModalHandler()
            return;
        }
        setLoading(true)
        console.log(contestInfo.url,"***********")
        try{
            const res=await fetch('https://code-buddy-2-0.onrender.com/set-contest-reminder',{                 
                method:"POST", 
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    LocalId:props.LocalId,
                    notification_time: moment(contestInfo.start_time).subtract(60,'minutes'),  ///////////// risk ase
                    ContestInfo:{
                        name:contestInfo.name,
                        site:contestInfo.site,
                        start_time:contestInfo.start_time,
                        contestLink:contestInfo.url
                    }
                })                                        
           })
           
           let parsedRes
           if(!res.ok){
                if(res.statusText)
                    throw new Error(res.statusText)
                parsedRes=await res.json()
                throw new Error(parsedRes.error.message)
           }
           parsedRes=await res.json()

           // update the list of contests
           props.updateReminderStatusAfterRemAddition(parsedRes)

           // show added reminder modal
           setNotiPermission("ReminderAdded")
           showModalHandler()
           setLoading(false)
        }catch(error){
            setNotiPermission("error")
            showModalHandler()
            setLoading(false)
        }
    }

    // checks some cases of permission for notification
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
            setNotiPermission("error")
            showModalHandler()
        }
    }
    

    const removeRemiBtnHandler=()=>{
        setNotiPermission("reallyRemoveReminder?")
        showModalHandler()
    }


    const removeReminderFromDB=async()=>{
        try{
            setLoading(true)
            let url=`https://code-buddy-2-0.onrender.com/remove-user-reminder-contest`
            // req to remove reminder
            const result= await fetch(url,{             /////////////////////////////////////////////////
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
                        start_time:contestInfo.start_time,
                        contestLink:contestInfo.url
                    }
                })                                        
            })

            let parsedRes
            if(!result.ok){
                if(result.statusText)
                    throw new Error(result.statusText)
                parsedRes=await result.json()
                throw new Error(parsedRes.error.message)
            }
            parsedRes=await result.json()

            // then update the original list too
            props.updateReminderStatusAfterRemRemove(parsedRes)
            // set removed modal
            setNotiPermission("reminderRemoved")
            showModalHandler()
            setLoading(false)
        }catch(error){
            setNotiPermission("error")
            showModalHandler()
            setLoading(false)
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
    }else if(notiPermission==="error"){
        ModalContent=<ReminderModalContent 
                        content="Something went wrong!!!"
                        btnContent="Ok"
                        clickHandler={removeModalHandler}/>
    }


    let SetRemiBtn=null
    // showing the btn only if atleast 1 hour is left to start
    if(contestInfo.reminderAdded===true){
        SetRemiBtn= <Button type="button" clickHandler={ removeRemiBtnHandler } Danger={true}  >Remove reminder</Button>
    }else if( moment().add(70,'minutes')<= moment(contestInfo.start_time) ){
        SetRemiBtn= <Button type="button" clickHandler={setRemiBtnHandler} colorName={"Blue"}>Set Reminder Before 1 hr</Button>
    }


    let ContestDetails=null
    // deciding contest info all
    if(showFullContestInfo){
        ContestDetails=(
            <div className="card-body-user-gen-info">
                <UserInfoRow Attribute={"Name"} Value={contestInfo.name?contestInfo.name:"Not available"} />
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Start time"} Value={moment(contestInfo.start_time).format('Do MMMM YYYY, h:mm a')?moment(contestInfo.start_time).format('Do MMMM YYYY, h:mm a'):"Not available"} />
                <hr className="hr-user-gen-info"/>
                
                <UserInfoRow Attribute={"Duration"} Value={contestInfo.duration?getDurationFormat(contestInfo.duration):"Not available"} />
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Site"} Value={contestInfo.site?contestInfo.site:"Not available"} />
                <hr className="hr-user-gen-info"/>                

                <UserInfoRow Attribute={"In 24 hours"} Value={contestInfo.in_24_hours?contestInfo.in_24_hours:"Not available"} />
                <hr className="hr-user-gen-info"/>

                <div className="setRemi-GoToContest-btn" >
                    {SetRemiBtn}
                    <a href={contestInfo.url} onClick={e=>e.stopPropagation() } target="_blank" rel="noreferrer" > <span onClick={e=>e.stopPropagation()}> Go To Contest </span> </a>  
                </div>
            </div>
        )
    }else{
        ContestDetails=(
            <div className="only-name-div">
                <span>{contestInfo.name}</span>
            </div>
        )
    }

    const ContestDetailsHandler=(e)=>{
        setShowFullContestInfo(state=>!state)
    }

    return (

        <Fragment>
            {loading?<OpenSpinner/>:null}
            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModalHandler}> {ModalContent} </Modal>  :null}

            <div className="card-user-gen-info" onClick={ContestDetailsHandler}   >
                {ContestDetails}
            </div>

        </Fragment>

    )
}


export default Contest;