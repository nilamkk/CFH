import Modal from "../Modal/Modal"

const ErrorHandler=(props)=>{
    // errorMessage , modelRemovedHandler
    return (
        <Modal show={true} modelRemoved={props.modelRemovedHandler} >
            <p>{props.errorMessage}</p>
        </Modal>
    )
}

export default ErrorHandler