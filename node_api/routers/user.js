const express= require('express')
const User=require('../models/user')
const Reminder=require('../models/reminders')

const router = new express.Router()

router.get('/youuu',(req,res)=>{
    res.send("YOUuuu !!!")
})

router.post('/create-user',async (req,res)=>{ 
    // req.body={Handle,LocalId}
    const user=new User({
        ...req.body,
        Categories:[],
        ReminderSubscriptions:[],
        ReminderContests:[]
    })
    try{
        await user.save()
        res.send(user)
    }catch(error){
        console.log(error.message)
        res.status(500).send({
            error:error.message
        })
    }
})

router.post('/get-handle',async (req,res)=>{   // correct--verified twice
    try{
        const user=await User.findOne({LocalId:req.body.LocalId})

        if(!user){
            throw new Error("User not found !!!" )
        }

        console.log(user.Handle)
        res.send({
            Handle:user.Handle
        })
    }catch(error){
        console.log(error.message)
        res.status(400).send({
            error:error.message
        })
    }
})
router.post('/update-user-subscription',async (req,res)=>{   // working great :)
    // {LocalId,subscription}
    try{
        let user=await User.findOne({LocalId:req.body.LocalId})

        if(!user){
            throw new Error("User not found !!!" )
        }

        user.ReminderSubscriptions.push(
            req.body.subscription
        )
        user=await user.save()

        res.send({
            status:"Subscription updated!!"
        })

    }catch(error){
        console.log(error.message)
        res.status(400).send({
            error:error.message
        })
    }
})
router.post('/set-contest-reminder',async (req,res)=>{   
    // {LocalId,notification_time,ContestInfo:(name,start_time,site) }
    try{
        let reminder=await Reminder.findOne({
            notification_time: new Date(req.body.notification_time),  //// have to be a date obj
            notification_status:"NotYetSend",
            ContestInfo:{
                name: req.body.ContestInfo.name,
                start_time: new Date(req.body.ContestInfo.start_time),        
                site: req.body.ContestInfo.site
            }
        })

        if(!reminder){
            // create one
            reminder= new Reminder({
                notification_time: req.body.notification_time,  //// try date if no work
                notification_status:"NotYetSend",
                ContestInfo:{
                    name: req.body.ContestInfo.name,
                    start_time: req.body.ContestInfo.start_time,        //// try date if no work
                    site: req.body.ContestInfo.site
                },
                SubscriberIDs:[req.body.LocalId]
            })
            reminder= await reminder.save()
        }else{
            // add the LocalId
            reminder.SubscriberIDs.push(
                req.body.LocalId
            )
            reminder= await reminder.save()
        }

        // add this reminder info to user too
        let user= await User.findOne({LocalId:req.body.LocalId})

        if(!user){
            throw new Error("User not found !!!" )
        }

        user.ReminderContests.push({
            name:req.body.ContestInfo.name,
            site:req.body.ContestInfo.site,
            start_time:req.body.ContestInfo.start_time
        })
        user= await user.save()

        res.send({
            name:req.body.ContestInfo.name,
            site:req.body.ContestInfo.site,
            start_time:req.body.ContestInfo.start_time
        })

    }catch(error){
        console.log(error.message)
        res.status(400).send({
            error:error.message
        })
    }
})
router.get('/get-user-reminder-contests',async (req,res)=>{   
    //{LocalId}
    try{
        const user=await User.findOne({LocalId:req.query.LocalId})

        if(!user){
            throw new Error("User not found !!!" )
        }
        res.send(user.ReminderContests) // array
    }catch(error){
        console.log(error.message)
        res.status(400).send({
            error:error.message
        })
    }
})
router.post('/remove-user-reminder-contest',async (req,res)=>{   
    // {LocalId,notification_time,ContestInfo:(name,start_time,site) }
    try{
        let reminder=await Reminder.findOne({
            notification_time: new Date(req.body.notification_time),  //// have to be a date obj
            notification_status:"NotYetSend",
            ContestInfo:{
                name: req.body.ContestInfo.name,
                start_time: new Date(req.body.ContestInfo.start_time),        
                site: req.body.ContestInfo.site
            }
        })

        if(reminder){
            // remove LocalId
            const index= reminder.SubscriberIDs.indexOf(req.body.LocalId)
            if(index>-1){
                reminder.SubscriberIDs.splice(index,1)
            }
            reminder= await reminder.save()
            // delete if no subscriber
            if(reminder.SubscriberIDs.length===0){
                let deletedRem= await Reminder.findOneAndDelete({
                    notification_time: new Date(req.body.notification_time),  //// have to be a date obj
                    notification_status:"NotYetSend",
                    ContestInfo:{
                        name: req.body.ContestInfo.name,
                        start_time: new Date(req.body.ContestInfo.start_time),        
                        site: req.body.ContestInfo.site
                    }
                })
                console.log("Deleted !!!")
            }
        }

        // remove this reminder info from user too
        let user= await User.findOne({LocalId:req.body.LocalId})

        if(!user){
            throw new Error("User not found !!!" )
        }
        
        let indexOfItemToRemove=-1
        let itemToSearchU={
            name:req.body.ContestInfo.name,
            site:req.body.ContestInfo.site,
            start_time:req.body.ContestInfo.start_time
        }
        for(let k=0;k<user.ReminderContests.length;k++){
            if( user.ReminderContests[k].name===itemToSearchU.name 
                && user.ReminderContests[k].site===itemToSearchU.site
                && (new Date(user.ReminderContests[k].start_time).getTime())===(new Date(itemToSearchU.start_time).getTime())  )
            {
                indexOfItemToRemove=k;
                break;
            }
        }
        if(indexOfItemToRemove>-1){
            user.ReminderContests.splice(indexOfItemToRemove,1)    
        }
        user= await user.save()

        res.send(itemToSearchU)  // this item should be updated in the UI

    }catch(error){
        console.log(error.message)
        res.status(400).send({
            error:error.message
        })
    }
})



module.exports= router

