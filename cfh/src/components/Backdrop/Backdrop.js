import React from 'react';

import './Backdrop.css'


const backdrop=props=>{
    let classes
    if(props.class){
        classes="OpenSpinner-back"
    }else{
        classes="Backdrop"
    }

    return (
        props.show?<div className={classes} onClick={props.clicked}></div>:null
    )
}

export default backdrop;