
import  './Button.css'



const Button=(props)=>{


    let classes=["Button"]

    if(props.disable){
        classes.push("Disabled")
    }else if(props.Danger){
        classes.push("Danger")
    }


     return(
        // type, clickHandler,disable,children,Danger
         <button 
            type={props.type} 
            onClick={props.clickHandler}
            className={classes.join(" ")}
            disabled={props.disable}
            style={{color:props.colorName}}>
            {props.children}
            
         </button>
     )
 }


 export default Button;