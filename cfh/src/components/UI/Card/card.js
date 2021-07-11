import './card.css'

const Card=props=>{

    return (
        <div class="card">

            <div className="card-header text-primary font-weight-bold">
              {props.header}
            </div>

            <div className="card-body text-primary">
                <div >
                    {props.children}
                </div>
            </div>


        </div>
    )

}


export default Card;