

const Input=(props)=>{
    return(
        <div>
          {/* type,htmlFor=id,Lable,refer,placeHolder */}
          <label htmlFor={props.htmlFor}>{props.Label}</label>
          <input 
            type={props.type} 
            id={props.htmlFor} 
            ref={props.refer} 
            placeholder={props.placeHolder} 
            onChange={props.onChnageHandler}
            required />
        </div>
    )
}


export default Input;