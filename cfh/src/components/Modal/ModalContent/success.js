import Button from "../../Buttons/Button"

const Success=props=>{
    return(
        <div>
            {props.message}
            {props.noBtn?null:(
                <Button
                type="button"
                clickHandler={props.removeModal}
                colorName={"Blue"}>Ok</Button>
            )}

        </div>
    )
}

export default Success
