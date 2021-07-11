import Button from "../../Buttons/Button";

const ReminderModalContent=(props)=>{

    return(
        <div>
            {props.content? <p>{props.content}</p> :null}
            {props.contestInfo?(
                <div>
                    <p>{props.contestInfo.site}: {props.contestInfo.name}</p>
                    <p>Starts at: {props.starts_at}</p>
                </div>
            ):null}

            <Button type="button"  clickHandler={props.clickHandler}>{props.btnContent}</Button>
        </div>
    )

}



export default ReminderModalContent;
