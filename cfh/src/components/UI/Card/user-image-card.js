import './user-image-card.css'

const ImageCard=props=>{

    let mainContainerDivClasses="card-user-image"

    if(props.twoUsers===true){
        mainContainerDivClasses+=" card-user-image-fifty"
    }

    return(
        <div className={mainContainerDivClasses}>
            <div className="card-body-user-image text-center-user-image d-flex-user-image flex-column-user-image align-items-center-user-image">
                
                <img src={props.titlePhoto} alt="I am user" className="rounded-circle-user-image" />
                {props.firstName?<h4>{props.firstName} </h4>:null}
                {props.lastName?<h4>{props.lastName}</h4>:null}
                {props.city?<p className="text-secondary-user-image">{props.city}</p>:null}
                {props.country?<p className="text-secondary-user-image">{props.country}</p>:null}
                
            </div>
        </div>
    )

}

export default ImageCard

