require('./../db/mongoose')

const Reminder= require('../models/reminders')
const User= require('../models/user')
const webpush=require('web-push')
const schedule=require('node-schedule')

// function definations
webpush.setVapidDetails(process.env.WEB_PUSH_MAIL_TO, process.env.WEB_PUSH_PUBLIC_KEY, process.env.WEB_PUSH_PRIVATE_KEY);

const sendReminder=(subscription,ContestInfo)=>{  //////////////////////////// time has to be formatted in client
    // send subscription
    // console.log("Sub: ",subscription)
    const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.keys.auth,
          p256dh: subscription.keys.p256dh
        }
    };
    webpush.sendNotification(pushSubscription, JSON.stringify({title: `${ContestInfo.site}: ${ContestInfo.name}`, content: `Starts at ${ContestInfo.start_time}`,url:'https://www.google.com/'}))
    .catch(function(err) {
        console.log(err);
    })
}
const handleUser=async (LocalId,ContestInfo)=>{
    // LocalId is a user
    const user= await User.findOne({LocalId:LocalId})
    if(!user)
        return;
    user.ReminderSubscriptions.forEach(
        (sub)=>sendReminder(sub,ContestInfo)
    )

    let index=-1
    
    for(let i=0;i<user.ReminderContests.length;i++){
        if(ContestInfo.name===user.ReminderContests[i].name
            && ContestInfo.site===user.ReminderContests[i].site
            && (new Date(ContestInfo.start_time).getTime())===( new Date(user.ReminderContests[i].start_time).getTime() ) )
        {
            index=i;
            break;
        }
    }
    if(index>-1){
        user.ReminderContests.splice(index,1)
        await user.save()  ///////////////////////////////////// doubt
    }
}
const handleReminder=async (reminder)=>{

    reminder.SubscriberIDs.forEach(
        (LocalId)=>{
                handleUser(LocalId,reminder.ContestInfo)
                .catch((error)=>{
                    console.log("Failed to handle user")
                    console.log(error)
                })
        }
    )
    let deletedItem= await Reminder.findOneAndDelete({
        notification_time: new Date(reminder.notification_time),  //// have to be a date obj
        notification_status:"NotYetSend",
        ContestInfo:{
            name: reminder.ContestInfo.name,
            start_time: new Date(reminder.ContestInfo.start_time),        
            site: reminder.ContestInfo.site
        }
    })
}

// find the appropriate reminders
const scheduledReminderSender=async ()=>{
    const d= new Date().getTime()
    const dU=d+420000
    console.log("1")
    const reminders= await Reminder.find({
        notification_time:{ $gte:new Date(d) , $lte:new Date(dU) }
    })
    console.log("2")
    if(reminders.length===0){
        return;
    }
    reminders.forEach(
        (item)=>handleReminder(item)
    )
}

// do the following every 5 min
// get the reminders from db where notification_time is between b and b+ 7min   where b is the current time
// for all the reminders fetched do the following
// for all the subscribers send notification + remove this info from ReminderContests
// then remove this reminder from db
// */5 * * * *

schedule.scheduleJob('5-min-reminder-job','*/5 * * * *',()=>{
    
    // Description: It will fetch appropriate reminders from DB.
    // for each reminder send notification to each user, deletes info from each user and ultimately deletes that reminder
    scheduledReminderSender()
    .then((i)=>{
        console.log("hoi gol")
        console.log(i)
    }).catch((error)=>{
        console.log("error aahile")
        console.log(error)
    })
})







