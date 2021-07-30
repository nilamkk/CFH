const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
    notification_time: {
        type: Date,          
        index:true           ///////////////////////////////////////////////////////////////////////////////////////// not sure though
    },
    notification_status: {
        type: String        // values: 'NotYetSend' / 'Sent'
    },  
    SubscriberIDs: [{
        type: String        
    }],
    ContestInfo:{
        name:String,
        start_time:Date,        
        site:String,             
        contestLink:String
    }
})


const Reminder = mongoose.model('Reminders', reminderSchema)

module.exports = Reminder

