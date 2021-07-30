import './card.css'

const Card=props=>{

    let mainContainerClasses="card"
    if(props.twoUser===true){
        mainContainerClasses+=" card-two-user"
    }

    return (
        <div className={mainContainerClasses}>
            <div className="card-header text-primary font-weight-bold">
              {props.header}
            </div>

            <div className="card-body text-primary">
                {props.children}
            </div>
        </div>
    )

}


export default Card;