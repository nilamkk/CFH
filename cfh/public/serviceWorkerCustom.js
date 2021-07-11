
self.addEventListener('activate',events=>{
    console.log("[Service worker] activated ")
    return self.clients.claim()
})

// listening to click notification event
self.addEventListener('notificationclick',(event)=>{
    let notification=event.notification
    let action=event.action 

    console.log(notification)

    if(action==='okay'){
        console.log('okay was chosen')
        notification.close()
    }else{
        console.log('go to site was chosen')
        event.waitUntil(
            clients.openWindow(notification.data.url).then((wind)=>{
                notification.close()
            })
        )
    }
})



// listener to push notification
self.addEventListener('push',(event)=>{
    console.log("push notification received!!!")
    
    let data={title:'New', content:'Something new happend!!'}
    
    if(event.data){ 
        data=JSON.parse(event.data.text())
    }

    let options={
        body:data.content,                       //////////////////////////// starts_at
        icon:'/images/icons/reminder.png',
        badge:'/images/icons/reminder.png',
        actions:[
            {action:'Go to site',title:'Okay'},
            {action:'okay',title:'Cancel'}
        ],
        data:{
            url:data.url                        //////////////////////////// from server 
        }
    }

    // dont know why this event.waitUntil()?
    event.waitUntil( 
        // dont know why not the old way? 
        self.registration.showNotification(data.title,options)   /// title should be: platform-name
    )

})


