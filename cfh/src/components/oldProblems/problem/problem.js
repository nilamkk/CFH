
import {useState} from 'react'
import { Fragment } from 'react'

import '../addProblem/addProblem.css'
import Tag from './tags'
import Button from '../../Buttons/Button'
import Modal from '../../Modal/Modal'
import AddProblemModal from '../../Modal/ModalContent/addProblemModal'
import Success from '../../Modal/ModalContent/success'
import UserInfoRow from '../../UI/Card/user-info-row'

const Problem=({item,nonZeroCategories,categories,setCategoryOfAddedProblem})=>{

    const [clicked,setClicked]=useState(false)
    const [showModal,setShowModal]=useState(false)
    const [problemAddStatus,setProblemAddStatus]=useState(null) //////// values it posses= null, "Successfully added !!!", "Failed to add !!!"

    const onCLickHandler=()=>{
        setClicked(state=>!state)
    }
    const saveProblemHandler=(e)=>{
        // bring the modal
        setShowModal(state=>true)
        setProblemAddStatus(null)
        e.stopPropagation();
    }
    const removeModal=()=>{
        setShowModal(state=>false)
    }

    let ModalContent= null

    if( !problemAddStatus ){
        ModalContent= <AddProblemModal  
                        problemName={(item.index? (item.index+". "):"")+item.name}
                        categories={categories}
                        problemId={item._id}
                        setCategoryOfAddedProblem={setCategoryOfAddedProblem}
                        setProblemAddStatus={setProblemAddStatus}/>
    }else if(problemAddStatus==="Successfully added !!!"){  
        ModalContent= <Success message={"Successfully Added !!!"} removeModal={removeModal}/> 
    }else if(problemAddStatus==="Failed to add !!!"){
        ModalContent= <Success message={"Something went wrong !!!"} removeModal={removeModal}/>
    }else if(problemAddStatus==="addingProblem"){
        ModalContent= <Success message={"Please wait !!!"} removeModal={removeModal} noBtn={true}/>
    }

    // https://codeforces.com/contest/1540/problem/A 
    let linkOfProblem=`https://codeforces.com/contest/${item.contestId}/problem/${item.index}`

    let ProblemDetails=null

    if(clicked){
        ProblemDetails=(
            <div className="card-body-user-gen-info">
                <UserInfoRow Attribute={"Name" } Value={`${(item.index? item.index+". " :null)}${item.name}` }/>
                <hr className="hr-user-gen-info"/>

                <UserInfoRow Attribute={"Points" } Value={item.points}/>
                <hr className="hr-user-gen-info"/>

                {item.category? (<Fragment>
                    <UserInfoRow Attribute={"Category" } Value={item.category}/>
                    <hr className="hr-user-gen-info"/>
                </Fragment>) :null}

                <div>
                    <Tag tags={item.tags}/>
                </div>


                <div className="setRemi-GoToContest-btn" >
                    {(item.category? null : <Button 
                                                type="button" 
                                                clickHandler={saveProblemHandler}
                                                disable={nonZeroCategories===false}
                                                colorName={"Blue"}>
                                                    Save problem
                                                </Button>)}
                    <a href={linkOfProblem} onClick={e=>e.stopPropagation() } target="_blank" rel="noreferrer" > <span onClick={e=>e.stopPropagation()}> Go To Problem </span> </a>  
                </div>


            </div>
        )
    }else{
        ProblemDetails=(
            <div className="only-name-div">
                <span>{item.index? item.index+". " :null  }{item.name}</span>
            </div>
        )
    }



    return (

        <Fragment>
            {showModal? <Modal show={showModal} 
                                modelRemoved={removeModal}> {ModalContent} </Modal>  :null}
            
            <div className="card-user-gen-info" onClick={onCLickHandler}>
                {ProblemDetails}
            </div>

        </Fragment>
    )


}

export default Problem