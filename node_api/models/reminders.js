const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
    notification_time: {
        type: Date          // string valid date can be passed
    },
    notification_status: {
        type: String        // values: 'NotYetSend' / 'Sent'
    },  
    SubscriberIDs: [{
        type: String        // convert it to obj id to search
    }],
    ContestInfo:{
        name:String,
        start_time:Date,        // pass a string valid date
        site:String             ///////////////////////////////// will have to add contest link
    }
})


const Reminder = mongoose.model('Reminders', reminderSchema)

module.exports = Reminder

