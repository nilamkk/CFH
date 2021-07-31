const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_ATLAS_CLUSTER_STRING,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

// const expSchema = new mongoose.Schema({
//     Handle: {
//         type: String,
//         required: true,
//         trim: true
//     }
// })
// const Exp = mongoose.model('Exp', expSchema)

// const schedule=require('node-schedule')

// const mJob=schedule.scheduleJob('m-job','*/1 * * * *',async ()=>{
//     console.log("Exp saving...")
//     const exp=new Exp({
//         Handle:"NKK"
//     })

//     await exp.save()
//     console.log("Exp saved!!!")

// })


// schedule.scheduleJob('cancel-job',new Date(2021, 05, 26, 3,02, 00, 0),()=>{
//     console.log("Job cancelling...")
//     schedule.cancelJob('m-job')
//     console.log("Job cancelled!!!")
// })






