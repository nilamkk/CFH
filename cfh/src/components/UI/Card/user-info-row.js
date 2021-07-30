

const User_info_row= props=>{
    return (
        <div className="row-element-user-gen-info">
                    
            <div className="attribute-element-user-gen-info">
                <h6 className="h6-user-gen-info">    {props.Attribute} </h6>
            </div>
            
            
            <div className="value-element-user-gen-info  text-secondary">
                {props.Value}
            </div>

        </div>
    )
}


export default User_info_row;