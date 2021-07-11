const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    contestId: {
        type: Number,
        trim: true
    },
    index: {
        type: String,
        trim: true,
        uppercase:true
    },
    name: {
        type: String,
        trim: true,
        uppercase:true
    },    
    type: {
        type: String,
        trim: true,
        uppercase:true
    },
    points: {
        type: Number,
        trim: true
    },    
    tags: [{
        type: String,
        trim: true,
        lowercase:true
    }]
})


const Problem = mongoose.model('Problem', problemSchema)

module.exports = Problem

