
import { Fragment } from "react";
// import  './Button.css'

const Select=(props)=>{


    const handleChange=(e)=>{
        props.setState(e.target.value)
    }

     return(
        // categories is an array
        <Fragment>
            <select onChange={handleChange}
                    required={true}>
                <option value="" >Select category</option>
                { props.categories.map(
                    item=><option 
                            value={item.title}
                            key={item._id}>
                                {item.title}</option>
                )}
            </select>
        </Fragment>

     )
 }


 export default Select;