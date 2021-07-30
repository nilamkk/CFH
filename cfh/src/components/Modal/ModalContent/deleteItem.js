import Button from "../../Buttons/Button"

const Delete=props=>{
    return(
        <div>
            All the problems under this category will be deleted. Still wana delete it?
            <Button
                type="button"
                clickHandler={props.clickDeleteHandler}
                colorName={"Blue"}>Yes</Button>
        </div>
    )
}

export default Delete
