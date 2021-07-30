// utility functions
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// creating a subscription
const configurePushSub=async (LocalId)=>{
    if(  !('serviceWorker' in navigator)){
        return;
    }
    // try{
        const swreg= await navigator.serviceWorker.ready;
        const sub= await swreg.pushManager.getSubscription()
        if(sub){
            console.log("already exist")
            return;
        }
        let publicVapidKey=process.env.REACT_APP_PUSH_PUBLIC_KEY
        let convertedPublicVapidKey=urlBase64ToUint8Array(publicVapidKey)

        let newSub= await swreg.pushManager.subscribe({     
            userVisibleOnly:true,
            applicationServerKey:convertedPublicVapidKey   
        })
        let url="/update-user-subscription"          
        let res= await fetch(url,{            
            method:"POST", 
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify({
                LocalId:LocalId,
                subscription:newSub
            })                                         
       })
       const parsedRes= await res.json()
       if(res.ok){
            console.log("created new subscription and saved !!!")
       }else{
           throw new Error(parsedRes.error.message)   /////////////////
       }
    // }catch(error){
    //     console.log(error)                                                      /////////////////////////////////////////////////////////
    // }
}

// ask for permission
export const askNotificationPermission=async (LocalId)=>{
    // getting notification permission will get us push permission for free!!!
    
    return Notification.requestPermission((result)=>{
        console.log("User choice ",result)
        if(result!=='granted'){
            console.log('Not allowed notifications!!')
        }else{
            return configurePushSub(LocalId)
        }
    })
}

