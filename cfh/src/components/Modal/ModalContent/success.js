import Button from "../../Buttons/Button"

const Success=props=>{
    return(
        <div>
            DONE
            <Button
                type="button"
                clickHandler={props.removeModal}>Ok</Button>
        </div>
    )
}

export default Success
