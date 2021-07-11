require('./mongoose')
const User= require('../models/user')

 


const doAll=async ()=>{
    let user=await User.findOne({Handle:'Hawkeye_2000'})
    console.log(user)
    user.Categories.push({
        title:'My dp problems',
        problems:[{
            name:'0 1 knapsack'
        }]
    })
/*
    let user=new User({
        Handle:'Hawkeye_2000',
        LocalId:'localId',
        Categories:[]
    })

*/
    

    user=await user.save()
    console.log(user)
}


doAll().then((item)=>{
    console.log('done!!!')
}).catch((error)=>{
    console.log(error)
})